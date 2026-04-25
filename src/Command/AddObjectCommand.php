<?php

namespace App\Command;

use App\DTO\Context;
use App\DTO\ObjectData;
use App\Service\CatalogueWriter;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'catalogue:add',
    description: 'Ajouter un objet mathematique au catalogue',
)]
class AddObjectCommand extends Command
{
    private const REQUIRED_OPTIONS = ['slug', 'titre', 'notation', 'sens', 'contrat', 'symetrie', 'ports', 'cablage'];

    public function __construct(private readonly Context $context)
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addOption('slug', null, InputOption::VALUE_REQUIRED, 'Nom de fichier (sans .md)')
            ->addOption('titre', null, InputOption::VALUE_REQUIRED, 'Titre H1 de la fiche')
            ->addOption('notation', null, InputOption::VALUE_REQUIRED, 'Notation inline code')
            ->addOption('sens', null, InputOption::VALUE_REQUIRED, 'Description du sens')
            ->addOption('contrat', null, InputOption::VALUE_REQUIRED, 'Signature de type')
            ->addOption('symetrie', null, InputOption::VALUE_REQUIRED, 'symetrique ou asymetrique')
            ->addOption('ports', null, InputOption::VALUE_REQUIRED, 'Description des ports')
            ->addOption('cablage', null, InputOption::VALUE_REQUIRED, 'Description du cablage')
            ->addOption('dry-run', null, InputOption::VALUE_NONE, 'Affiche les modifications sans les appliquer');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $projectRoot = $this->context->projectRoot;

        $missing = [];
        foreach (self::REQUIRED_OPTIONS as $opt) {
            if (!$input->getOption($opt)) {
                $missing[] = "--{$opt}";
            }
        }
        if ($missing) {
            $io->error('Options manquantes : ' . implode(', ', $missing));
            return Command::FAILURE;
        }

        try {
            $data = new ObjectData(
                slug: $input->getOption('slug'),
                titre: $input->getOption('titre'),
                notation: $input->getOption('notation'),
                sens: $input->getOption('sens'),
                contrat: $input->getOption('contrat'),
                symetrie: $input->getOption('symetrie'),
                ports: $input->getOption('ports'),
                cablage: $input->getOption('cablage'),
            );
        } catch (\InvalidArgumentException $e) {
            $io->error($e->getMessage());
            return Command::FAILURE;
        }

        $writer = new CatalogueWriter($projectRoot);

        if ($writer->ficheExists($data)) {
            $io->error("Le fichier docs/catalogue/{$data->slug}.md existe deja.");
            return Command::FAILURE;
        }

        if ($writer->slugInCatalogue($data)) {
            $io->error("Le slug '{$data->slug}' apparait deja dans docs/catalogue/README.md");
            return Command::FAILURE;
        }

        if ($input->getOption('dry-run')) {
            $io->title('DRY RUN - Aucune modification appliquee');

            $io->section("Fiche : docs/catalogue/{$data->slug}.md");
            $io->writeln($writer->generateFiche($data));

            $catalogueContent = file_get_contents("{$projectRoot}/docs/catalogue/README.md");
            $io->section('Ligne ajoutee dans docs/catalogue/README.md');
            $io->writeln("| [{$data->titre}]({$data->slug}.md) | `{$data->contrat}` | {$data->symetrie} |");

            $io->section('Ligne ajoutee dans README.md');
            $io->writeln("| -- [{$data->titre}](docs/catalogue/{$data->slug}.md) | {$data->sens} |");

            return Command::SUCCESS;
        }

        $writer->write($data);

        $io->success([
            "Fiche creee : docs/catalogue/{$data->slug}.md",
            'Catalogue mis a jour : docs/catalogue/README.md',
            'Sommaire mis a jour : README.md',
        ]);

        $io->note([
            'TODO manuel :',
            '  - Ajouter le bloc mermaid dans docs/catalogue/README.md',
            "  - Ajouter des sections supplementaires dans docs/catalogue/{$data->slug}.md (currying, liens...)",
            '  - Mettre a jour docs/catalogue/ombre-sphere.md si l\'objet s\'insere dans le circuit',
        ]);

        return Command::SUCCESS;
    }
}
