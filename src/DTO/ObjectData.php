<?php

namespace App\DTO;

class ObjectData
{
    public function __construct(
        public readonly string $slug,
        public readonly string $titre,
        public readonly string $notation,
        public readonly string $sens,
        public readonly string $contrat,
        public readonly string $symetrie,
        public readonly string $ports,
        public readonly string $cablage,
    ) {
        if ($slug === '') {
            throw new \InvalidArgumentException('Le slug ne peut pas etre vide.');
        }

        if (!in_array($symetrie, ['symetrique', 'asymetrique'], true)) {
            throw new \InvalidArgumentException(
                "--symetrie doit etre 'symetrique' ou 'asymetrique', recu : '{$symetrie}'"
            );
        }
    }
}
