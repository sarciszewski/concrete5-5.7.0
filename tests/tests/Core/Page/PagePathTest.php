<?php

class PagePathTest extends PageTestCase {

    public function testPageUpdateSubpagePaths()
    {
        $about = self::createPage('About');
        $me = self::createPage('Me', $about);
        foreach(array('Interests', 'Social', 'Foo', 'Other', 'Page') as $name) {
            self::createPage($name, $me);
        }

        $foo = Page::getByPath('/about/me/foo');
        self::createPage('Bar', $foo);

        $social = Page::getByPath('/about/me/social');
        $this->assertFalse($social->isError());
        $this->assertEquals(5, $social->getCollectionID());

        $nvc = $me->getVersionToModify();
        $this->assertEquals(2, $nvc->getVersionID());
        $nvc->update(array("cHandle" => 'about-me'));

        $test = Page::getByPath('/about/me');
        $this->assertFalse($test->isError());
        $this->assertEquals(3, $test->getCollectionID());
        $this->assertEquals('/about/me', $test->getCollectionPath());

        $v = CollectionVersion::get($nvc, $nvc->getVersionID());
        $v->approve(false);

        $test = Page::getByPath('/about/me');
        $this->assertEquals(COLLECTION_NOT_FOUND, $test->isError());
        $test = Page::getByPath('/about/about-me');
        $this->assertFalse($test->isError());
        $this->assertEquals('/about/about-me', $test->getCollectionPath());
        $subpage = Page::getByPath('/about/about-me/foo/bar');
        $this->assertFalse($subpage->isError());
        $this->assertEquals('/about/about-me/foo/bar', $subpage->getCollectionPath());
    }


    /**
     * Add a page and check its canonical path.
     */
    public function testCanonicalPagePaths()
    {
        $home = Page::getByID(HOME_CID);
        $pt = PageType::getByID(1);
        $template = PageTemplate::getByID(1);
        $page = $home->add($pt, array(
                'uID'=>1,
                'cName'=> 'Test page',
                'pTemplateID' => $template->getPageTemplateID()
            ));

        $path = $page->getCollectionPathObject();
        $this->assertInstanceOf('\Concrete\Core\Page\PagePath', $path);
        $this->assertEquals('/test-page', $path->getPagePath());
        $this->assertEquals($path->isPagePathCanonical(), true);

        $newpage = $page->add($pt, array(
                'uID'=>1,
                'cName'=> 'Another page for testing!',
                'pTemplateID' => $template->getPageTemplateID()
            ));

        $path = $newpage->getCollectionPathObject();
        $this->assertEquals('/test-page/another-page-testing', $path->getPagePath());
        $this->assertEquals($path->isPagePathCanonical(), true);
    }

    /**
     * Set a canonical page path.
     */
    public function testSettingCanonicalPagePaths()
    {
        $home = Page::getByID(HOME_CID);
        $pt = PageType::getByID(1);
        $template = PageTemplate::getByID(1);
        $page = $home->add($pt, array(
                'uID'=>1,
                'cName'=> 'My fair page.',
                'pTemplateID' => $template->getPageTemplateID()
            ));

        $page->setCanonicalPagePath('/a-completely-new-canonical-page-path');
        $testPath = Loader::db()->getEntityManager()->getRepository('\Concrete\Core\Page\PagePath')->findOneBy(
            array('cID' => $page->getCollectionID(), 'ppIsCanonical' => true
        ));
        $this->assertInstanceOf('\Concrete\Core\Page\PagePath', $testPath);
        $this->assertEquals('/a-completely-new-canonical-page-path', $testPath->getPagePath());

        $path = $page->getCollectionPathObject();

        $this->assertEquals('/a-completely-new-canonical-page-path', $path->getPagePath());
        $this->assertEquals('my-fair-page', $page->getCollectionHandle());
    }

    public function testNonCanonicalPagePaths()
    {
        $home = Page::getByID(HOME_CID);
        $pt = PageType::getByID(1);
        $template = PageTemplate::getByID(1);
        $page = $home->add($pt, array(
                'uID'=>1,
                'cName'=> 'About',
                'pTemplateID' => $template->getPageTemplateID()
            ));

        $path1 = $page->addAdditionalPagePath('/about-us');
        $path2 = $page->addAdditionalPagePath('/another/path/to/the/about/page');

        $this->assertEquals($path1->getPagePath(), '/about-us');
        $canonicalpath = $page->getCollectionPathObject();
        $this->assertEquals($canonicalpath->getCollectionID(), 2);
        $this->assertEquals($canonicalpath->getPagePath(), '/about');
        $this->assertEquals($path2->getPagePath(), '/another/path/to/the/about/page');
        $this->assertEquals($path2->isPagePathCanonical(), false);

        $pathArray = $page->getAdditionalPagePaths();
        $this->assertEquals(2, count($pathArray));
        $this->assertEquals($pathArray[1], $path2);

        $page->clearAdditionalPagePaths();
        $pathArray = $page->getAdditionalPagePaths();
        $this->assertEquals(0, count($pathArray));
    }

    public function testPagePathUpdate()
    {
        $home = Page::getByID(HOME_CID);
        $pt = PageType::getByID(1);
        $template = PageTemplate::getByID(1);
        $page = $home->add($pt, array(
                'uID'=>1,
                'cName'=> 'Here\'s a twist',
                'pTemplateID' => $template->getPageTemplateID()
            ));

        $nc = $page->getVersionToModify();
        $nc->addAdditionalPagePath('/something/cool', false);
        $nc->addAdditionalPagePath('/something/rad', true);
        $nc->update(array('cName' => 'My new name', 'cHandle' => false));
        $nv = $nc->getVersionObject();
        $nv->approve();

        $nc2 = Page::getByID(2);
        $this->assertEquals('/my-new-name', $nc2->getCollectionPath());
        $this->assertEquals('my-new-name', $nc2->getCollectionHandle());
        $this->assertEquals(2, $nc2->getVersionID());
        $path = $nc2->getCollectionPathObject();

        $this->assertInstanceOf('\Concrete\Core\Page\PagePath', $path);
        $this->assertEquals('/my-new-name', $path->getPagePath());
        $this->assertEquals(true, $path->isPagePathCanonical());
        $additionalPaths = $nc2->getAdditionalPagePaths();
        $this->assertEquals(2, count($additionalPaths));
        $this->assertEquals('/something/rad', $additionalPaths[1]->getPagePath());
        $this->assertEquals(false, $additionalPaths[1]->isPagePathCanonical());
    }

    public function testPagePathSuffixes()
    {
        $about = self::createPage('About');
        $contact = self::createPage('Contact Us', $about);
        $contact2 = self::createPage('Contact Us', $about);

        $this->assertEquals('/about/contact-us-1', $contact2->getCollectionPath());
        $this->assertEquals('/about/contact-us', $contact->getCollectionPath());
        $pathObject = $contact2->getCollectionPathObject();
        $this->assertInstanceOf('\Concrete\Core\Page\PagePath', $pathObject);
        $this->assertEquals('/about/contact-us-1', $pathObject->getPagePath());

        $testing1 = self::createPage('Testing');
        $testing2 = self::createPage('Testing', $about);
        $testing1->move($contact);
        $testing2->move($contact);

        $this->assertEquals('/about/contact-us/testing', $testing1->getCollectionPath());
        $this->assertEquals('/about/contact-us/testing-1', $testing2->getCollectionPath());

        $testingPageObject = Page::getByPath('/about/contact-us/testing-1');
        $this->assertEquals(6, $testingPageObject->getCollectionID());
    }

    public function testPagePathEvent()
    {
        $blog = self::createPage('Blog');
        $post1 = self::createPage('Post', $blog);
        $pathObject = $post1->getCollectionPathObject();
        $this->assertInstanceOf('\Concrete\Core\Page\PagePath', $pathObject);
        $this->assertEquals('/blog/post', $pathObject->getPagePath());

        Events::addListener('on_compute_canonical_page_path', function($event) {
            $parent = Page::getByID($event->getPageObject()->getCollectionParentID());
            if ($parent->getCollectionPath() == '/blog') {
                // strip off the handle
                $path = substr($event->getPagePath(), 0, strrpos($event->getPagePath(), '/'));
                $path .= '/year/month/day/';
                $path .= $event->getPageObject()->getCollectionHandle();
                $event->setPagePath($path);
            }
        });

        $post2 = self::createPage('Another Post', $blog);
        $this->assertEquals('/blog/year/month/day/another-post', $post2->getCollectionPath());

        $post2Object = Page::getByPath('/blog/year/month/day/another-post');
        $this->assertEquals(4, $post2Object->getCollectionID());

        $addendum = self::createPage('Addendum', $post2Object);
        $path = $addendum->getCollectionPathObject();
        $this->assertInstanceOf('\Concrete\Core\Page\PagePath', $path);
        $this->assertEquals('/blog/year/month/day/another-post/addendum', $path->getPagePath());

        $home = Page::getByID(1);
        $addendum->move($home);
        $this->assertEquals('/addendum', $addendum->getCollectionPath());
    }

}