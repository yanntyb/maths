<?php

namespace App\Service;

use App\DTO\ObjectData;

class CatalogueWriter
{
    public function __construct(
        private readonly string $projectRoot,
    ) {
    }

    public function generateFiche(ObjectData $data): string
    {
        return <<<MD
# {$data->titre}

> [Retour au catalogue](README.md)

`{$data->notation}`

- **[Sens](../vocabulaire/triple-distinction.md)** -- {$data->sens}
- **Contrat** -- `{$data->contrat}` ({$data->symetrie})
- **Ports** -- {$data->ports}
- **Cablage** -- `{$data->cablage}`
MD;
    }

    public function insertInCatalogue(string $content, ObjectData $data): string
    {
        $nouvelleLigne = "| [{$data->titre}]({$data->slug}.md) | `{$data->contrat}` | {$data->symetrie} |";

        return preg_replace(
            '/(\n)\| \| \|/',
            "\n{$nouvelleLigne}\n| | |",
            $content,
            1,
        );
    }

    public function insertInSommaire(string $content, ObjectData $data): string
    {
        $nouvelleLigne = "| -- [{$data->titre}](docs/catalogue/{$data->slug}.md) | {$data->sens} |";

        return preg_replace(
            '/(\| -- \[.*?\]\(docs\/catalogue\/.*?\) \|.*?\|\n)(\| \[Feuille de route\])/',
            "$1{$nouvelleLigne}\n$2",
            $content,
            1,
        );
    }

    public function write(ObjectData $data): void
    {
        $fichePath = "{$this->projectRoot}/docs/catalogue/{$data->slug}.md";
        $catalogueReadme = "{$this->projectRoot}/docs/catalogue/README.md";
        $rootReadme = "{$this->projectRoot}/README.md";

        file_put_contents($fichePath, $this->generateFiche($data) . "\n");
        file_put_contents(
            $catalogueReadme,
            $this->insertInCatalogue(file_get_contents($catalogueReadme), $data),
        );
        file_put_contents(
            $rootReadme,
            $this->insertInSommaire(file_get_contents($rootReadme), $data),
        );
    }

    public function ficheExists(ObjectData $data): bool
    {
        return file_exists("{$this->projectRoot}/docs/catalogue/{$data->slug}.md");
    }

    public function slugInCatalogue(ObjectData $data): bool
    {
        $content = file_get_contents("{$this->projectRoot}/docs/catalogue/README.md");

        return str_contains($content, "{$data->slug}.md");
    }
}
