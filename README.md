# 197_CDRIN_Matane_MicroAstro

Code pour un algorythme de transfer de style.

## Installer le projet 
Suivez les étapes suivantes :

- Télécharger ce fichier au format *zip* en cliquanr sur **code** puis **Download Zip**
- Décompresser le fichier *zip* dans votre fichier **Documents**
- Pour windows:
    1. Ouvrir **PowerShell** en tant qu'administrateur
        - Faire un clic droit sur le logo du menu de démarrage
        - Sélectionnez **Terminal Windows(admin)**
    2. Se rendre dans le dossier **197_CDRIN_Matane_MicroAstro**
        - Copiez la ligne suivante dans votre terminal :
            - cd ~\Documents\197_CDRIN_Matane_MicroAstro
        - Si une erreur apparait, alors essayez la commande suivante :
            - cd ~\OneDrive\Documents\197_CDRIN_Matane_MicroAstro
        N.B. : Pour faire un copier-coller, copiez le texte sélectionné avec *ctrl+c* puis collez avec un clic droit dans le terminal
    3. Installer **Python**
        - La première étape est d'autoriser *PowerShell* à télécharger un script 
            - Tapez la commande suivante :
                - Set-ExecutionPolicy -Scope CurrentUser
            - Puis entrez **RemoteSigned** dans le champs *ExecutionPolicy*
            - Ensuite confirmez votre choix (Taper sur *O* ou *T*)
        - Maintenant il faut installer le manager de package Windows avec la commande suivante :
            - iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
        - Enfin installez **Python** avec la commande suivante :
            - choco install -y python3
        - Testez l'installation avec la ligne suivante :
            - py.exe --version
        - Si aucune erreur ne s'affiche, félicitation ! 
- Pour Linux : 
    1. Ouvrir un terminal :
        - Grâce à l'explorateur de fichier, rendez-vous dans le dossier **197_CDRIN_Matane_MicroAstro**
        - Faire un clic droit dans le dossier
        - Sélectionnez **Ouvrir terminal**
    2. Installer **Python**
        - Mettre à jour les paquets existants :
            - sudo apt-get update
        - Enfin installez **Python** avec la commande suivante :
            - sudo sudo apt-get install python

## Utiliser le projet
Suivez les étapes suivantes :
- Lancer le server :
    1. Dans un terminal, se rendre dans le fichier *executable* :
        - cd executable
    2. Lancer le programme *microAstro.py*:
        - py.exe microAstro.py
- Ouvrir le site Web
    1. Grâce à l'explorateur de fichier, ouvrez le fichier *frontend*
        - Double-cliquez sur le fichier **index.html**
- Amusez-vous !
