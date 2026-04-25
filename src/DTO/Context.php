<?php

namespace App\DTO;

class Context
{
    public function __construct(
        public readonly string $projectRoot,
    ) {}
}
