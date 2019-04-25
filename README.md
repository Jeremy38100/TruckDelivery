Jérémy Roche & Lucas Freyssinet

Master 2 MIAGE - Université Grenoble Alpes - Option Energie

# 🚚 📦 📅 Livraison avec des véhicules électriques

## Présentation

### Variables d'environnement
| Name               | Descripition                               | Unit | Value  |
| ------------------ | ------------------------------------------ | ---- | ------ |
| capacity           | Capacité maximum du camion                 | Kg   | 100    |
| max_dist           | distance maxmimum avant une charge         | Km   | 250    |
| max_duration       | Durée maximale de travail d'un camion      | sec  | 43200  |
| time_charge_fast   | Temps de chargement avec la recharge fast  | sec  | 60     |
| time_charge_midium | Temps de chargement avec la recharge fast  | sec  | 180    |
| time_charge_slow   | Temps de chargement avec la recharge fast  | sec  | 480    |
| time_delivery      | Temps de déchargement de la livraison      | sec  | `300 + nb_bags * 30` |

### Contraintes
- 🚚 ne peut pas prendre des commandes dont le poids total est supérieur à `capacity`
- 🚚 ne peut pas parcourir une distance supérieur à `max_dist` avant une recharge
- 🚚 ne peut pas partir du dépot avant `start_time`
- 🚚 ne peut pas s'arreter moins de `temps_de_recharge` secondes lors d'une pause recharge
- 📦les commandes ne sont pas divisés dans plusieurs camions
- 👥 tous les clients sont livrés

### Fonction objectif

F = &sum;(w<sub>i</sub> * f<sub>i</sub>)

Objectif : minimiser `F`

<!-- - min : max(0, &sum;[d<sub>i</sub>x<sub>i</sub> - capacity]) -->

Trouver des poids sur les contraintes

| Contrainte                  | Poids |
| --------------------------- | ----- |
| livrer tous les clients     | 95    |
| distance avant rechargement | 100   |
| capcaité max du camion      | 80    |
| durée max du camion         | 75    |

### Travail rendu
- Code commenté
- Tests (validation)

## Lancer l'application
A la racine du projet lancer un **webserver** (par exemple avec Pyhton : `python -m SimpleHTTPServer 8000`)

Se rendre sur un **navigateur Web** à l'adresse : `localhost:8000`

Ouvrir la console développeur du navigateur web pour voir les logs.

# Export

Fichier .txt

2,4,C,5,R,12   // Vehicule 1
6,3         // Vehicule 2

C = chargement des paquets : entrepots
R = Recharge ou Recharge et Chargement

## Fonction de calcul de résultat

```
+ distanceTotal // km
+ (dureeTotale / 600) // s
+ ((nbVehicule - 1) * 500)
+ (nbViolContrainteDistance * 50000)
+ (nbViolContrainteQuantite * 10000)
+ (nbViolContrainteDuration * 1000)
+ ((nbMissingVisits + nbMultipleVisit) * 100000);
```

# Files structure
* `/css` : contains stylsheets files
* `/dist` : contains WebApp dependencies (Map integration, markers ...)
* `/examples` : contains data examples
  * `example` : contains a single example
    * `coords.txt` : warehouse is the last one
    * `demandes.txt`
    * `distances.txt`
    * `times.txt`
    * `vehicle.txt`
