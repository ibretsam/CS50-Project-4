from django.test import TestCase
from selenium import webdriver
import unittest

# Create your tests here.
class GoogleTestCase(unittest.TestCase):

    def setUp(self):
        self.browser = webdriver.Chrome('/Users/MasterBi/Downloads/chromedriver')
        self.addCleanup(self.browser.quit)

    def test_page_title(self):
        self.browser.get('http://www.google.com')
        self.assertIn('Google', self.browser.title)

if __name__ == '__main__':
    unittest.main(verbosity=2)