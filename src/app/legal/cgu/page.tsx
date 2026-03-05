import { MILAN_NAME } from '@/lib/constants';

export default function CGUPage() {
    const date = new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="page-container max-w-4xl mx-auto py-32 px-6">
            <h1 className="font-serif text-4xl gold-text mb-4 tracking-widest uppercase">
                Conditions Générales d&apos;Utilisation
            </h1>
            <p className="text-white/30 text-xs mb-12 uppercase tracking-widest">Dernière mise à jour : {date}</p>

            <div className="prose prose-invert max-w-none space-y-10 text-white/70 leading-relaxed text-sm">
                <section>
                    <h2 className="text-lg font-serif text-white mb-3 uppercase tracking-wider">Article 1 — Objet</h2>
                    <p>
                        Les présentes Conditions Générales d&apos;Utilisation (ci-après « CGU ») définissent les modalités d&apos;accès et d&apos;utilisation du site milansky.com et de l&apos;ensemble des services qui y sont proposés (ci-après « les Services »), édité par [NOM PRÉNOM] (ci-après « l&apos;Éditeur »). L&apos;inscription sur le Site implique l&apos;acceptation pleine et entière des présentes CGU. L&apos;Éditeur se réserve le droit de modifier les CGU à tout moment.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-serif text-white mb-3 uppercase tracking-wider">Article 2 — Définitions</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>« Utilisateur »</strong> : toute personne physique accédant au Site.</li>
                        <li><strong>« Membre »</strong> : tout Utilisateur ayant créé un compte et souscrit à un abonnement.</li>
                        <li><strong>« {MILAN_NAME} IA »</strong> : le système de conversation automatisé intégré au Site.</li>
                        <li><strong>« Skycoins »</strong> : unités virtuelles utilisables exclusivement sur le Site.</li>
                        <li><strong>« Contenu »</strong> : ensemble des textes, images, vidéos et éléments multimédia.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-serif text-white mb-3 uppercase tracking-wider">Article 3 — Accès au Site et inscription</h2>
                    <p>
                        3.1 — L&apos;accès au Site est réservé aux personnes physiques majeures (18 ans révolus). En créant un compte, l&apos;Utilisateur certifie avoir au minimum 18 ans.<br />
                        3.2 — L&apos;inscription nécessite la fourniture d&apos;informations exactes. L&apos;Utilisateur est seul responsable de la confidentialité de ses identifiants.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-serif text-white mb-3 uppercase tracking-wider">Article 4 — Description des Services</h2>
                    <p>
                        Le Site propose un univers de contenu numérique premium organisé en tiers d&apos;accès progressifs (GUEST, BASIC, ELITE, ICON).
                        {MILAN_NAME} IA est un programme informatique généré par intelligence artificielle ; l&apos;Editeur ne garantit pas l&apos;exactitude des réponses.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-serif text-white mb-3 uppercase tracking-wider">Article 5 — Skycoins</h2>
                    <p>
                        Les Skycoins sont des unités virtuelles non échangeables, non transférables et non remboursables. Ils n&apos;ont aucune valeur monétaire hors du Site.
                        En cas de suppression du compte, les Skycoins non utilisés sont définitivement perdus.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-serif text-white mb-3 uppercase tracking-wider">Article 6 — Comportement</h2>
                    <p>
                        Sont notamment interdits : la diffusion de contenus illicites, le scraping, le partage ou la revente de contenu du Site, et l&apos;usurpation d&apos;identité.
                        Tout manquement peut entraîner la suppression immédiate du compte.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-serif text-white mb-3 uppercase tracking-wider">Article 7 — Propriété intellectuelle</h2>
                    <p>
                        L&apos;ensemble des contenus est protégé par le droit de la propriété intellectuelle. Toute capture d&apos;écran ou partage est strictement interdit.
                    </p>
                </section>
            </div>
        </div>
    );
}
