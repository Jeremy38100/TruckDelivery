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
- 📦 les commandes ne sont pas divisés dans plusieurs camions
- 👥 tous les clients sont livrés

### Travail rendu
- Code commenté
- Tests (validation)
- Instruction d'installation / Execution
- Copyright et Licences
- Export (un fichier par heuristique)
- Réponses PDF / MD
  - Reference au code
- A rendre le 6 Juin

## Lancer l'application
A la racine du projet lancer un **webserver** (par exemple avec Pyhton : `python -m SimpleHTTPServer 8000`)

Se rendre sur un **navigateur Web** à l'adresse : `localhost:8000`

Ouvrir la console développeur du navigateur web pour voir les logs.

# Export

Fichier `.txt`

```
2, 4, C, 5, R, 12 // Vehicule 1
6, 3              // Vehicule 2
```

* C = Chargement des paquets : entrepots
* R = Recharge ou Recharge et Chargement

## Fonction de calcul de résultat

```{javascript}
+ distanceTotal // km
+ (dureeTotale / 600) // s
+ ((nbVehicule - 1) * 500)
+ (nbViolContrainteDistance * 50000)
+ (nbViolContrainteQuantite * 10000)
+ (nbViolContrainteDuration * 1000)
+ ((nbMissingVisits + nbMultipleVisit) * 100000);
```

# Files structure
* `/dist` : contains WebApp dependencies (Map integration, markers ...)
* `/datasets` : contains data datasets
  * `dataset` : contains a single dataset
    * `coords.txt` : warehouse is the last one
    * `demandes.txt`
    * `distances.txt`
    * `times.txt`
    * `vehicle.txt`
* `/scripts` : contains app logic
    * `map.js`
    * `script.js`
    * `utils.js`
    * `/neighbourhood` :
      * `Neighbourhood.js` : abstract class describing a Neighbourhood process
    * `/schedule`
      * `/ride`
        * `Ride.js` : abstract class describing a Ride
      * `/truckSchedule`
          * `TruckSchedule.js`
      * `Order.js`
* `index.html` : contains main HTML code

# Data Structure

### 👤Order

```typescript
class Order {
    clientIndex: number,
    order: number, // number of bags in the order
    coords: [number, number],
    duration: number // duration to delivery the order
}
```

### 🚚 Ride

A Ride is a list of orders the driver can process without coming back to warehouse

```typescript
class Ride {
    rideIndex: number,
    orders: Order[], // orders to delivery in this ride
}
```

### 🚚 🗒 TruckSchedule

A truck schedule is the list of rides the driver have to process

```typescript
class TruckSchedule {
    rides: Ride[],
}
```

### 📋 Schedule

A Schedule is the daily planning of all drivers

```typescript
class Schedule {
    truckSchedules: TruckSchedule[],
}
```

# Improvements :
🔋 The recharge timeout (1h) is not implemented yet. We should integrate it when we build the solution.