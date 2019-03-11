Jérémy Roche & Lucas Freyssinet

Master 2 MIAGE - Université Grenoble Alpes - Option Energie

# 🚚 📦 📅 Livraison avec des véhicules électriques

## Variables d'environnement
| Name               | Descripition                               | Unit | Value  |
| ------------------ | ------------------------------------------ | ---- | ------ |
| capacity           | Maximum truck capacity                     | Kg   | 100    |
| max_dist           | Maximum truck distance in one full charge  | Km   | 250    |
| start_time         | Minimum start time trucks leave depot      | sec  | 25200  |
| end_time           | Maximum time trucks come back depot        | sec  | 68400  |
| time_charge_fast   | Temps de chargement avec la recharge fast  | sec  | 60     |
| time_charge_midium | Temps de chargement avec la recharge fast  | sec  | 180    |
| time_charge_slow   | Temps de chargement avec la recharge fast  | sec  | 480    |
| time_delivery      | Temps de déchargement de la livraison      | sec  | `300 + nb_bags * 30` |

## Contraintes
- 🚚 ne peut pas prendre des commandes dont le poids total est supérieur à `capacity`
- 🚚 ne peut pas parcourir une distance supérieur à `max_dist` avant une recharge
- 🚚 ne peut pas partir du dépot avant `start_time`
<!-- - 🚚 ne peut pas arriver au dépot après `end_time`-->
<!-- - 🚚 ne peut pas avoir un planning qui dure plus de `end_date - start_date` sur la journée -->
- 🚚 ne peut pas s'arreter moins de `temps_de_recharge` secondes lors d'une pause recharge
- 👥 tous les clients sont livrés
-

## Contrainte molle
Explorer l'espace des solutions

- min : max(0, &sum;[d<sub>i</sub>x<sub>i</sub> - capacity])

Trouver des poids sur les contraintes

F = &sum;w<sub>i</sub> * f<sub>i</sub>

| Contrainte                  | Poids |
| --------------------------- | ----- |
| livrer tous les clients     | 100   |
| distance avant rechargement | 70    |
| capcaité max du camion      | 70    |
| durée max du camion         | 70    |