import logging
from datetime import timedelta
from os import getenv
from typing import Final, Iterable, TypedDict

from django.utils import timezone

from hoagiemail.email import get_listservs
from hoagiemail.email.mailjet_client import get_mailjet_client
from hoagiemail.models import StuffPost

REQUEST_TIMEOUT: Final[timedelta] = timedelta(seconds=10)
SUMMER: Final[bool] = False
SANDWITCH: Final[str] = "<img height=\"22\" src='https://i.imgur.com/gkEZQ4x.png' title='Hoagie' />"
LOGO: Final[str] = "<img height=\"180px\" src='https://i.imgur.com/kidY9cT.png' alt='Hoagie Digest' />"
IS_PRODUCTON: Final[bool] = getenv("HOAGIE_MODE") == "production"

logger = logging.getLogger(__name__)


def link(text: str, link: str) -> str:
	return f"<a target='_blank' href=\"{link}\">{text}</a>"


def link_mail(text: str) -> str:
	return link(text, "mailto:" + text)


def format_tag(text: str) -> str:
	return f'<span style="color: #474d66; background-color:#edeff5; padding: 0px 6px; border-radius:4px; margin-right: 1px;">{text.title()}</span>'


def add_tags(email: str, tags: Iterable[str]) -> str:
	email += "<div style='margin-top: 6px;'>"

	for tag in tags:
		email += format_tag(tag) + " "

	email += "</div>"

	return email


def format_message(message: StuffPost) -> str:
	email = ""
	name = str(message.user)
	link_email = link_mail(message.user.email)

	match str(message.category):
		case "sale":
			tags = [str(t) for t in message.tags.all()]

			if not tags:
				tags = message.title.split(", ")
			# There's a TODO: remove here that I am not sure if I should remove

			email += f"<div style='margin:10px 0px;'>{message.description}</div>"
			email += f"<span><b>Contact: </b>{name} ({link_email})</span><br />"
			add_tags(email, tags)
		case "lost":
			if message.thumbnail:
				email += '<span><a target=\'_blank\' href="" + message.thumbnail + "">See Picture</a></span><br />'

			email += "<span><b>" + message.tags[0].upper() + ": </b>" + message.title + "</span><br />"
			email += "<div style='margin:5px 0px;'>" + message.description + "</div>"
			email += f"<span><b>Contact: </b>{name} ({link_email})</span><br />"
		case _:
			email += "<span><b>" + message.title + "</b></span><br />"
			email += "<div style='margin:5px 0px;'>" + message.description + "</div>"
			email += f"<span><b>From: </b>{name} ({link_email})</span><br />"
			add_tags(email, [str(t) for t in message.tags.all()])

	return email


MailJetData = TypedDict(
	"MailJetData",
	{
		"From": dict[str, str],
		"ReplyTo": dict[str, str],
		"Cc": list[dict[str, str]],
		"Subject": str,
		"Text-part": str,
		"Html-part": str,
		"CustomID": str,
	},
)


def mail_request(header: str, sender: str, body: str, email: str) -> None:
	data: MailJetData = {
		"From": {"Email": "hoagie@princeton.edu", "Name": sender},
		"ReplyTo": {"Email": email, "Name": sender},
		"Cc": get_listservs(),
		"Subject": header,
		"Text-part": body,
		"Html-part": body,
		"CustomID": "HoagieStuffDigest",
	}

	res = get_mailjet_client().send.create(data={"Messages": [data]})
	res.raise_for_status()

	if res.status_code != 201:
		raise RuntimeError("did not receive HTTP 201")

	if res.json()[0]["Status"] != "success":
		raise RuntimeError("message send not successful")


def run_digest_script() -> None:
	posts = StuffPost.objects.filter(has_sent=False)

	if not posts:
		logging.info("No messages found...Exiting...")
		return

	digest: dict[str, list[StuffPost]] = {}

	for post in posts:
		category_posts = digest.get(post.category.name, [])
		category_posts.append(post)
		digest[post.category.name] = category_posts

	if len(digest) < 5:
		is_weekday = timezone.now().weekday() in {1, 3, 5}

		is_digest_day = is_weekday and not SUMMER

		if not is_digest_day:
			logger.info("not a digest day...Exiting...")
			return

	logger.info("5 or more digest posts...Running...")

	body = f"""
    <div style="font-family: sans-serif;">
    <center>{LOGO}</center>

    {
		'<p><br />Here is a digest of posts made to <a href="https://stuff.hoagie.io/">Hoagie Stuff</a></p> over past few days. It\'s Summer, so Hoagie is taking things slow.</p>'
		if SUMMER
		else '''<p><br />Here is a weekly digest of posts made to <a href="https://stuff.hoagie.io/">Hoagie Stuff</a>, 
    from Sales to Lost & Found and more, sent every Tuesday, Thursday, and Saturday.</p>'''
	}

    <p>
        <a target="_blank" href="https://stuff.hoagie.io/">Open Hoagie Stuff</a> |
        <a target="_blank" href="https://stuff.hoagie.io/create">Add your message to next digest</a> | 
        <a target="_blank" href="https://tally.so/r/mYJjN3">Give feedback</a>
    </p>
    <hr />
    """

	if lost_posts := digest["lost"]:
		body += """
        <h2>🧭 Lost & Found</h2>
        <div style="margin-bottom:20px; margin-top:-10px;">Access anytime through <a href="https://stuff.hoagie.io/lost">stuff.hoagie.io/lost</a></div>

        """
		for i, post in enumerate(lost_posts):
			body += format_message(post)

			if i == len(lost_posts) - 1:
				body += "<br />"

			body += "<hr />"

	if bulletin_posts := digest["bulletin"]:
		body += """
        <h2>✉️ Bulletins</h2>
        <div style="margin-bottom:20px; margin-top:-10px;">Accessible anytime with <a href="https://stuff.hoagie.io/bulletins">stuff.hoagie.io/bulletins</a></div>
        """

		for i, post in enumerate(bulletin_posts):
			body += format_message(post)

			if i == len(bulletin_posts) - 1:
				body += "<br />"

			body += "<hr />"

	if len(digest) != 1:
		body += f"<p>That's all! This could have been {len(digest)} emails in your inbox but instead it is just one!<br /><br /></p>"

	body += f"""
    <p>You don't need to wait for the next digest to see what's new, check out the <a target="_blank" href="https://stuff.hoagie.io/">Hoagie Stuff</a>
        to keep up to date with the latest posts before others.</p>
    <center>
        {SANDWITCH} <br />
        <div style="font-size:8pt; margin-top:8px;">
        Powered by <a target="_blank" href="https://mail.hoagie.io/">HoagieMail</a><br />
        In the Hoagie world, hoagies digest you!
        </div>
    </center>
    </div>
    """

	if IS_PRODUCTON:
		mail_request(
			header=f"📬 DIGEST {timezone.now().strftime('%m/%d')}: Sales, Lost & Found, and more!",
			sender="Hoagie Mail",
			body=body,
			email="hoagie@princeton.edu",
		)

		logger.info("Sucessfully sent via Hoagie Mail")

		posts.update(has_sent=True)
