from datetime import timedelta
from typing import Final, TypedDict

from hoagiemail.email import get_listservs
from hoagiemail.email.mailjet_client import mailjet_client

REQUEST_TIMEOUT: Final[timedelta] = timedelta(seconds=10)
SUMMER: Final[bool] = False
SANDWITCH: Final[str] = "<img height=\"22\" src='https://i.imgur.com/gkEZQ4x.png' title='Hoagie' />"
LOGO: Final[str] = "<img height=\"180px\" src='https://i.imgur.com/kidY9cT.png' alt='Hoagie Digest' />"


class UserInfo:
    name: str
    email: str

    def __init__(self, name: str, email: str) -> None:
        self.name = name
        self.email = email


class Digest:
    title: str
    category: str
    contact: str
    description: str
    link: str
    thumbnail: str
    name: str
    email: str
    tags: list[str]
    user: UserInfo

    def __init__(
        self,
        title: str,
        category: str,
        contact: str,
        description: str,
        link: str,
        thumbnail: str,
        name: str,
        email: str,
        tags: list[str],
        user: UserInfo,
    ) -> None:
        self.title = title
        self.category = category
        self.contact = contact
        self.description = description
        self.link = link
        self.thumbnail = thumbnail
        self.name = name
        self.email = email
        self.tags = tags
        self.user = user


def link(text: str, link: str) -> str:
    return f"<a target='_blank' href=\"{link}\">{text}</a>"


def link_mail(text: str) -> str:
    return link(text, "mailto:" + text)


def format_tag(text: str) -> str:
    return f'<span style="color: #474d66; background-color:#edeff5; padding: 0px 6px; border-radius:4px; margin-right: 1px;">{text.title()}</span>'


def add_tags(email: str, tags: list[str]) -> str:
    email += "<div style='margin-top: 6px;'>"

    for tag in tags:
        email += format_tag(tag) + " "

    email += "</div>"

    return email


def format_message(message: Digest) -> str:
    email = ""
    name = message.name

    match message.category:
        case "sale":
            tags = message.tags

            if not tags:
                tags = message.title.split(", ")
            # There's a TODO: remove here that I am not sure if I should remove

            email += f"<div style='margin:10px 0px;'>{message.description}</div>"
            email += f"<span><b>Contact: </b>{name} ({link_mail(message.email)})</span><br />"
            add_tags(email, tags)
        case "lost":
            if message.thumbnail:
                email += '<span><a target=\'_blank\' href="" + message.thumbnail + "">See Picture</a></span><br />'

            email += "<span><b>" + message.tags[0].upper() + ": </b>" + message.title + "</span><br />"
            email += "<div style='margin:5px 0px;'>" + message.description + "</div>"
            email += f"<span><b>Contact: </b>{name} ({link_mail(message.email)})</span><br />"
        case _:
            email += "<span><b>" + message.title + "</b></span><br />"
            email += "<div style='margin:5px 0px;'>" + message.description + "</div>"
            email += f"<span><b>From: </b>{name} ({link_mail(message.email)})</span><br />"
            add_tags(email, message.tags)

    return email


class MailRequest:
    header: str
    sender: str
    body: str
    email: str

    def __init__(self, header: str, sender: str, body: str, email: str) -> None:
        self.header = header
        self.sender = sender
        self.body = body
        self.email = email


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


def mail_request(request: MailRequest) -> None:
    data: MailJetData = {
        "From": {"Email": "hoagie@princeton.edu", "Name": request.sender},
        "ReplyTo": {"Email": request.email, "Name": request.sender},
        "Cc": get_listservs(),
        "Subject": request.header,
        "Text-part": request.body,
        "Html-part": request.body,
        "CustomID": "HoagieStuffDigest",
    }

    res = mailjet_client.send.create(data={"Messages": [data]})
    res.raise_for_status()
    
    if res.status_code != 201:
        raise RuntimeError("did not receive HTTP 201")
    
    if res.json()[0]["Status"] != "success":
        raise RuntimeError("message send not successful")
