#!/bin/sh
# Copie le guide vers le site tyb-tech, servi sous /unit-distance/.
# Usage : ./publier.sh [dossier-du-site]   (par défaut : ~/Desktop/tyb-tech/sites/tyb_tech)
set -eu
ICI="$(cd "$(dirname "$0")" && pwd)"
SITE="${1:-$HOME/Desktop/tyb-tech/sites/tyb_tech}"
CIBLE="$SITE/public/unit-distance"
[ -d "$SITE/public" ] || { echo "Dossier public introuvable : $SITE/public" >&2; exit 1; }
mkdir -p "$CIBLE"
rsync -a --delete \
  --exclude 'CONCEPTION.md' --exclude 'PLAN.md' --exclude 'publier.sh' --exclude 'tests/' --exclude '.DS_Store' \
  "$ICI/" "$CIBLE/"
echo "Guide copié dans $CIBLE"
