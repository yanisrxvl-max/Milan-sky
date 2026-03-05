import { MILAN_NAME } from '@/lib/constants';

export default function CookiesPage() {
    return (
        <div className="page-container max-w-4xl mx-auto py-32 px-6">
            <h1 className="font-serif text-4xl gold-text mb-12 tracking-widest uppercase">
                Politique de Cookies
            </h1>

            <div className="prose prose-invert max-w-none space-y-10 text-white/70 leading-relaxed text-sm">
                <section>
                    <h2 className="text-lg font-serif text-white mb-3 uppercase tracking-wider">Qu&apos;est-ce qu&apos;un cookie ?</h2>
                    <p>
                        Un cookie est un petit fichier texte déposé sur votre terminal lors de la visite d&apos;un site web. Il permet de mémoriser vos actions et préférences.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-serif text-white mb-3 uppercase tracking-wider">Cookies utilisés</h2>
                    <p>
                        <strong>Cookies strictement nécessaires :</strong> Authentification (maintien de session), sécurité, et préférence de consentement.<br />
                        <strong>Cookies analytiques :</strong> Mesure d&apos;audience et analyse d&apos;utilisation (Mixpanel, etc.).
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-serif text-white mb-3 uppercase tracking-wider">Gestion du consentement</h2>
                    <p>
                        Vous pouvez configurer votre navigateur pour refuser les cookies.
                        Notez que la désactivation de certains cookies peut limiter les fonctionnalités du Site.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-serif text-white mb-3 uppercase tracking-wider">Conservation</h2>
                    <p>
                        Les cookies sont conservés pour une durée maximale de 13 mois conformément aux recommandations de la CNIL.
                    </p>
                </section>
            </div>
        </div>
    );
}
