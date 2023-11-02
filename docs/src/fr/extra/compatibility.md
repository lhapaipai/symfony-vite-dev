# Compatibilité

Afin de faciliter le versionning entre le bundle symfony et le plugin vite, j'ai décidé depuis la version 3.3.0 de synchroniser la version majeure et mineure des deux packages. Pour le numéro de patch, chaque package s'incrémente indépendamment en fonction des corrections de bugs respectives. Il n'y a donc pas de corrélations entre les versions de patch et il convient d'utiliser toujours la version la plus à jour.

| Symfony                  | Vite | pentatrion/vite-bundle | vite-plugin-symfony |
|--------------------------|------|------------------------|---------------------|
| ^4.4 \|\| ^5.0 \|\| ^6.0 | 3.x  | 2.x                    | 0.6.0 - 0.7.1       |
| ^4.4 \|\| ^5.0 \|\| ^6.0 | 4.x  | \>=3.0.x \<3.3.0       | ~0.7.2              |
| ^4.4 \|\| ^5.0 \|\| ^6.0 | 4.x  | 3.3.x                  | 3.3.x               |
| ^4.4 \|\| ^5.0 \|\| ^6.0 | 4.x  | 4.0.x                  | 4.0.x               |
| ^4.4 \|\| ^5.0 \|\| ^6.0 | 4.x  | 5.0.x                  | 5.0.x               |


