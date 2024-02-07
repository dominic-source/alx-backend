#!/usr/bin/env python3
"""This module helps with internalization and localization of the application.

    Config - contains configuration settings for the application.

    get_locale:
        Returns the preferred language for the user.

    welcome_page:
        Renders and returns the HTML welcome page.
"""

from flask_babel import Babel, gettext
from flask import Flask, render_template, request


class Config:
    """config available languages for the babel
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


# Instantiate the flask application
app = Flask(__name__)

# load configuration from class config object
app.config.from_object(Config)

# Instantiate Babel
babel = Babel(app)


@babel.localeselector
def get_locale():
    """Determines the preferred language for the user.

    Returns:
        str: Preferred language for the user.
    """
    value = request.args.get("locale")
    if value in app.config["LANGUAGES"]:
        return value
    return request.accept_languages.best_match(app.config["LANGUAGES"])


@app.route("/", methods=["GET"])
def welcome_page():
    """Renders the HTML welcome page.

    Returns:
        str: Rendered HTML welcome page.
    """

    title = gettext("Welcome to Holberton")
    header = gettext("Hello world!")
    return render_template('4-index.html',
                           home_title=title,
                           home_header=header)


if __name__ == '__main__':
    app.run(port=5000, host='0.0.0.0')
