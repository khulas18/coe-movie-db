import os
import urllib
import datetime

from google.appengine.api import users
from google.appengine.ext import ndb

import jinja2
import webapp2
import logging


JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

class MainHandler(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/main.html')
        self.response.write(template.render())

class ViewPage(webapp2.RequestHandler):
    def get(self,id):
        values = { "id" : id }
        template = JINJA_ENVIRONMENT.get_template('templates/view.html')
        self.response.write(template.render(values))

class HandlebarsHandler(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/handelbars.html')
        self.response.write(template.render())
class FBHandler(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/fbpost.html')
        self.response.write(template.render())

application = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/view/(.*)',ViewPage),
    ('/handlebars', HandlebarsHandler),
    ('/fb',FBHandler)
], debug=True)