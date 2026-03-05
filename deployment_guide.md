# 🚀 Guide de Mise en Ligne "Pas à Pas" (Milan Sky)

Félicitations ! Ton site est prêt. C'est une voiture de luxe (Next.js), et pour qu'elle roule parfaitement, on va utiliser la meilleure route possible.

### 🏁 Le Plan de Route
On va utiliser 3 outils simples :
1. **GitHub** : Le garage où on range ton code.
2. **Vercel** : Le moteur qui fait tourner ton site (Gratuit et ultra puissant).
3. **OVH** : La plaque d'immatriculation (ton nom de domaine `tonsite.com`).

---

### Étape 1 : Mettre ton code sur GitHub 📦
1. Crée un compte sur [GitHub.com](https://github.com).
2. Crée un nouveau "Repository" appelé `Milan-Sky`.
3. Envoie ton dossier actuel dessus. (Si tu ne sais pas comment faire, je peux t'aider avec une commande simple).

### Étape 2 : Lancer le moteur sur Vercel ⚡
1. Va sur [Vercel.com](https://vercel.com) et connecte-toi avec ton compte GitHub.
2. Clique sur **"Add New"** > **"Project"**.
3. Importe ton projet `Milan-Sky`.
4. **C'est ici qu'on met les clés !** Dans "Environment Variables", tu devras copier-coller les codes qui sont dans ton fichier `.env` (DATABASE_URL, etc.).
5. Clique sur **"Deploy"**. Ton site est en ligne sur une adresse bizarre (ex: `milan-sky.vercel.app`).

### Étape 3 : Brancher ton nom de domaine OVH 🏷️
1. Sur Vercel, va dans les **Settings** de ton projet, puis **Domains**.
2. Tape ton nom de domaine (ex: `milansky.com`) et clique sur **Add**.
3. Vercel va te donner deux "codes" (des enregistrements DNS : A and CNAME).
4. Connecte-toi à ton interface **OVH**.
5. Va dans **Domaines** > Ton domaine > **Zone DNS**.
6. Remplace les codes existants par ceux donnés par Vercel.
7. Attends un peu... et boum ! Ton site est accessible sur ton domaine.

---

### 💎 Pourquoi pas l'hébergement OVH directement ?
Ton site est une "Ferrari" technologique (Next.js). L'hébergement classique d'OVH est fait pour des "vélos" ou des petites voitures (sites simples). Vercel est fait exprès pour ton moteur, c'est gratuit au début, and c'est 100x plus rapide !

**Besoin d'aide pour une étape précise ? Dis-le moi, je suis là !**
