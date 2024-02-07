#!/usr/bin/env python3
"""This module helps me to learn about internalization and localization
"""

from flask_babel import Babel, _
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
    """return language type for various users preference
    """
    value = request.args.get("locale")
    if value in app.config["LANGUAGES"]:
        return value
    return request.accept_languages.best_match(app.config["LANGUAGES"])


@app.route("/", methods=["GET"])
def welcome_page():
    """Welcome page for our application to be able to work properly
    """

    title = _("Welcome to Holberton")
    header = _("Hello world!")
    return render_template('4-index.html',
                           home_title=title,
                           home_header=header)


if __name__ == '__main__':
    app.run(port=5000, host='0.0.0.0')
