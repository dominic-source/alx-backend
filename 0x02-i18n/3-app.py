#!/usr/bin/env python3
"""
    This module helps me to learn about internalization and localization
"""

from flask_babel import Babel, _
from flask import Flask, render_template, request


class Config:
    """config available languages for the babel"""
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
    """Get locale languages  for babels"""
    return request.accept_languages.best_match(app.config["LANGUAGES"])


@app.route("/", strict_slashes=False, methods=["GET"])
def welcome_page():
    """Welcome page for our application"""
    title = _("Welcome to Holberton")
    header = _("Hello world!")
    return render_template('3-index.html',
                           home_title=title,
                           home_header=header)


if __name__ == '__main__':
    app.run(port=5000, host='0.0.0.0')
