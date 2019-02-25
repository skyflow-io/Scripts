<?php

require __DIR__.'/../vendor/autoload.php';

use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

$fileSystem = new Filesystem();

$result = [];

$filesFinder = new Finder();
$filesFinder->files()->in('/app/src');

foreach ($filesFinder as $file) {
    $result[] = [
        'name' => preg_replace('#\.js$#', '', $file->getFilename()),
        'directory' => $file->getRelativePath(),
        'filename' => $file->getFilename(),
        'contents' => $file->getContents(),
    ];
}

$fileSystem->appendToFile('/app/scripts.json', json_encode($result));