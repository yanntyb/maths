'use strict';

/**
 * TabContract — Classe abstraite pour gestion onglets dynamiques
 *
 * Encapsule:
 * - Liste des cablages disponibles
 * - Index de navigation (current_index)
 * - Méthodes de navigation: next(), previous(), select()
 * - Méthodes de requête: current(), all(), count(), currentIndex()
 * - Rendu HTML abstrait: renderTabs(container)
 */
export class TabContract {
  constructor(cablages) {
    this.cablages = cablages;
    this.current_index = 0;
  }

  // Navigation
  next() {
    this.current_index = (this.current_index + 1) % this.cablages.length;
  }

  previous() {
    this.current_index = (this.current_index - 1 + this.cablages.length) % this.cablages.length;
  }

  select(index) {
    if (index >= 0 && index < this.cablages.length) {
      this.current_index = index;
    }
  }

  // Requêtes
  current() {
    return this.cablages[this.current_index];
  }

  all() {
    return this.cablages;
  }

  currentIndex() {
    return this.current_index;
  }

  count() {
    return this.cablages.length;
  }

  // À surcharger: générer UI dynamiquement
  renderTabs(container) {
    throw new Error('renderTabs() must be implemented by subclass');
  }
}

/**
 * TabManager — Implémentation concrète de TabContract
 *
 * Génère dynamiquement les onglets HTML à partir de la liste de cablages.
 * Chaque onglet affiche le titre du cablage et se met à jour au clic.
 */
export class TabManager extends TabContract {
  constructor(cablages, ui_container) {
    super(cablages);
    this.ui_container = ui_container;
    this.onSelect = null; // rappel après sélection par clic : onSelect(cablageCourant)
  }

  renderTabs(container) {
    // Générer dynamiquement les onglets HTML
    const tabsHTML = this.cablages.map((cab, i) => `
      <button class="tab ${i === this.current_index ? 'active' : ''}" data-index="${i}">
        ${cab.title}
      </button>
    `).join('');

    // Garder le label "CABLAGES" et remplacer les buttons
    const label = container.querySelector('span');
    container.innerHTML = label ? label.outerHTML : '';
    container.innerHTML += tabsHTML;

    // Event listeners
    container.querySelectorAll('.tab').forEach(btn => {
      btn.addEventListener('click', () => {
        this.select(parseInt(btn.dataset.index));
        this.renderTabs(container); // Re-render pour highlight actif
        if (this.onSelect) this.onSelect(this.current());
      });
    });
  }
}
