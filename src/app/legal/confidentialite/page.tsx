import { MILAN_NAME } from '@/lib/constants';

export default function PrivacyPage() {
    const date = new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="page-container max-w-4xl mx-auto py-32 px-6">
            <h1 className="font-serif text-4xl gold-text mb-4 tracking-widest uppercase">
                Politique de Confidentialité
            </h1>
            <p className="text-white/30 text-xs mb-12 uppercase tracking-widest">Dernière mise à jour : {date}</p>

            <div className="prose prose-invert max-w-none space-y-10 text-white/70 leading-relaxed text-sm">
                <section>
                    <h2 className="text-lg font-serif text-white mb-3 uppercase tracking-wider">1 — Données collectées</h2>
                    <p>
                        Nous collectons : votre adresse email, nom d&apos;utilisateur, date de naissance (vérification de majorité),
                        données de paiement (via Stripe), ainsi que les messages échangés avec {MILAN_NAME} IA.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-serif text-white mb-3 uppercase tracking-wider">2 — Finalités</h2>
                    <p>
                        Vos données sont utilisées pour la gestion de votre compte, la fourniture des Services, le traitement des paiements,
                        le fonctionnement de l&apos;IA, et l&apos;amélioration de votre expérience.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-serif text-white mb-3 uppercase tracking-wider">3 — Milan IA</h2>
                    <p>
                        Les messages échangés avec {MILAN_NAME} IA sont traités pour générer des réponses. Ils ne sont pas partagés à des fins publicitaires.
                        Vous pouvez demander la suppression de votre historique à tout moment.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-serif text-white mb-3 uppercase tracking-wider">4 — Vos Droits (RGPD)</h2>
                    <p>
                        Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, et d&apos;opposition.
                        Pour exercer ces droits : <strong>privacy@milansky.com</strong>.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-serif text-white mb-3 uppercase tracking-wider">5 — Sécurité</h2>
                    <p>
                        Nous mettons en œuvre des mesures techniques appropriées (HTTPS/TLS, hashage des mots de passe) pour protéger vos données.
                    </p>
                </section>
            </div>
        </div>
    );
}
