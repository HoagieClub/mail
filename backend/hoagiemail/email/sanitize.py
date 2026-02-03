from nh3 import Cleaner

# Configuration based on Quill editor toolbar options and generated HTML
ALLOWED_TAGS = {
	"a",
	"blockquote",
	"br",
	"em",
	"h1",
	"h2",
	"h3",
	"img",
	"li",
	"ol",
	"p",
	"s",
	"span",
	"strong",
	"sub",
	"sup",
	"u",
	"ul",
}

ALLOWED_ATTRIBUTES = {
	"*": {"style"},
	"a": {"href"},
	"img": {"src", "alt", "width"},
}

SAFE_CSS_PROPERTIES = {
	"width",
	"height",
	"color",
	"background-color",
	"font-size",
	"font-family",
	"text-align",
	"margin-top",
	"margin-bottom",
	"margin-left",
	"margin-right",
	"line-height",
}

sanitizer = Cleaner(
	tags=ALLOWED_TAGS,
	attributes=ALLOWED_ATTRIBUTES,
	filter_style_properties=SAFE_CSS_PROPERTIES,
)


def sanitize_html(html: str) -> str:
	"""Sanitize HTML content."""
	return sanitizer.clean(html)
