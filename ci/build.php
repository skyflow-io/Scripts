<?php

require __DIR__.'/../vendor/autoload.php';

use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

$fileSystem = new Filesystem();

$result = [];

$widgetFinder = new Finder();
$widgetFinder->files()->in('/app/src')->sortByName();
foreach ($widgetFinder as $widget) {
    $name = $widget->getBasename();
    $files = [
        'name' => preg_replace("#\.js$#i", "", $widget->getFilename()),
        'directory' => $widget->getRelativePath(),
        'filename' => $widget->getFilename(),
        'contents' => $widget->getContents(),
    ];
    $result[] = $files;
}

$doc = [];
$docFinder = new Finder();
$docFinder->files()->name('data.json')->in('/app/doc');
foreach ($docFinder as $file) {
    $doc = json_decode($file->getContents(), true);
}

$fileSystem->remove(['/app/data/scripts.json']);
$fileSystem->dumpFile('/app/data/scripts.json', json_encode($result));

$fileSystem->remove(['/app/doc/scripts.json']);
$fileSystem->dumpFile('/app/doc/scripts.json', json_encode($doc));