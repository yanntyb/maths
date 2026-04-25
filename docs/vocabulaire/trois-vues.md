# Trois vues

> [Retour au vocabulaire](README.md) | [Sens](../sens/)

Chaque objet propose **trois boutons** accessibles en permanence :

```mermaid
graph LR
    subgraph Objet["Objet mathematique"]
        BtnS["Sens"]:::btn --> Sens["bloc opaque\nlabel seul"]
        BtnC["Contrat"]:::btn --> Contrat["ports colores\ncarre=entree rond=sortie"]
        BtnW["Cablage"]:::btn --> Cablage["blocs internes\n+ connexions"]
    end

    classDef btn fill:#6366F1,color:#fff,stroke:#4F46E5
```

Pas de navigation sequentielle : les trois vues coexistent, l'utilisateur choisit librement.

## Application : le circuit de la sphere

| Vue | Ce qu'on voit |
|-----|---------------|
| **Sens** | un bloc "ombre de la sphere" |
| **Contrat** | trois ports d'entree (`Omega`, `E*`, `R`) et un port de sortie (`R`) |
| **Cablage** | les cinq blocs internes et leurs connexions |
