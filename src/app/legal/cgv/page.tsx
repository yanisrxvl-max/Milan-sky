import { MILAN_NAME } from '@/lib/constants';

export default function CGVPage() {
    const date = new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="page-container max-w-4xl mx-auto py-32 px-6">
            <h1 className="font-serif text-4xl gold-text mb-4 tracking-widest uppercase">
                Conditions Générales de Vente
            </h1>
            <p className="text-white/30 text-xs mb-12 uppercase tracking-widest">Dernière mise à jour : {date}</p>

            <div className="prose prose-invert max-w-none space-y-10 text-white/70 leading-relaxed text-sm">
                <section>
                    <h2 className="text-lg font-serif text-white mb-3 uppercase tracking-wider">Article 1 — Objet</h2>
                    <p>
                        Les présentes Conditions Générales de Vente (ci-après « CGV ») s&apos;appliquent à l&apos;ensemble des ventes réalisées sur le site milansky.com. Toute commande implique l&apos;acceptation sans réserve des présentes CGV.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-serif text-white mb-3 uppercase tracking-wider">Article 2 — Offres et prix</h2>
                    <p>
                        Le Site propose des abonnements récurrents et des packs de Skycoins. Les prix sont indiqués en euros TTC.
                        Conformément à l&apos;article 293 B du CGI, la TVA peut ne pas être applicable (franchise en base).
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-serif text-white mb-3 uppercase tracking-wider">Article 3 — Commande et Paiement</h2>
                    <p>
                        Le paiement est effectué par carte bancaire via la plateforme sécurisée (Stripe ou Revolut selon le mode actif).
                        Le Vendeur ne stocke aucune donnée bancaire. Les abonnements sont facturés de manière récurrente et automatique.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-serif text-white mb-3 uppercase tracking-wider">Article 4 — Résiliation</h2>
                    <p>
                        Le Client peut résilier son abonnement à tout moment depuis son espace membre. La résiliation prend effet à la fin de la période en cours. Aucun remboursement au prorata ne sera effectué.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-serif text-white mb-3 uppercase tracking-wider">Article 5 — Droit de rétractation</h2>
                    <p>
                        Conformément à l&apos;article L.221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour la fourniture de contenu numérique dont l&apos;exécution a commencé avec l&apos;accord exprès du Client.
                        En validant votre achat et en accédant au contenu, vous renoncez expressément à votre droit de rétractation.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-serif text-white mb-3 uppercase tracking-wider">Article 6 — Garanties</h2>
                    <p>
                        Le Client bénéficie de la garantie légale de conformité pour les contenus numériques. Pour toute question : contact@milansky.com.
                    </p>
                </section>
            </div>
        </div>
    );
}
