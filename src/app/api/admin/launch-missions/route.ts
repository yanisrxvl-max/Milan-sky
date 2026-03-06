import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { MissionStatus } from "@prisma/client";
// Define default missions to seed if the table is empty
const DEFAULT_MISSIONS = [
    // 1. Contenu
    { title: "Préparer 30 contenus pour le Mode Nuit", description: "Photos, vidéos, séries en avance pour alimenter la Bibliothèque et le Quotidirty.", category: "Contenu", order: 1, importance: "HIGH" },
    { title: "Préparer 5-10 contenus pour le Mode Jour", description: "Contenu gratuit d'appel (lifestyle, conseils) pour la page publique.", category: "Contenu", order: 2, importance: "MEDIUM" },
    { title: "Tester les 4 Muses principales", description: "Interagir avec les IA pour s'assurer que leurs prompts créent l'illusion parfaite.", category: "Contenu", order: 3, importance: "HIGH" },
    // 2. Technique
    { title: "Tester le parcours complet", description: "Créer un compte -> Acheter SC -> Débloquer un vlog.", category: "Technique", order: 4, importance: "HIGH" },
    { title: "Vérifier l'expérience mobile", description: "S'assurer que sur iPhone et Android, tout est fluide (boutons, chat, vidéos).", category: "Technique", order: 5, importance: "HIGH" },
    { title: "Vérifier le poids des vidéos Home", description: "Compresser ou re-héberger si nécessaire pour accélérer le temps de chargement.", category: "Technique", order: 6, importance: "MEDIUM" },
    // 3. Paiements
    { title: "Passer Stripe en mode Live", description: "Remplacer les clés de test Stripe par les clés de production dans Vercel.", category: "Paiements", order: 7, importance: "HIGH" },
    { title: "Faire un achat test complet", description: "Acheter un abonnement avec une vraie CB (puis se faire rembourser).", category: "Paiements", order: 8, importance: "HIGH" },
    { title: "Configurer l'interface de dons 2.5%", description: "Créer un visuel d'attente certifié sur la page Engagement.", category: "Paiements", order: 9, importance: "LOW" },
    // 4. Marketing & Comm
    { title: "Relire tous les textes du site", description: "Chasser les fautes d'orthographe et uniformiser le ton 'Mes causes' / 'Mon univers'.", category: "Marketing", order: 10, importance: "MEDIUM" },
    { title: "Personnaliser les emails", description: "S'assurer que les emails d'achat et d'inscription reflètent ton univers.", category: "Marketing", order: 11, importance: "LOW" },
    // 5. Sécurité
    { title: "Vérifier les mentions légales & CGV", description: "Remplacer les derniers 'Vous' par 'Tu' si pertinent, et s'assurer que Milan Sky couvre tes arrières.", category: "Sécurité", order: 12, importance: "HIGH" },
    { title: "Vérifier les variables d'environnement", description: "Double checker le fichier .env en production (Vercel).", category: "Sécurité", order: 13, importance: "HIGH" },
];

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let missions = await prisma.launchMission.findMany({
            orderBy: { order: 'asc' },
        });

        // Seed logic if empty
        if (missions.length === 0) {
            console.log("Seeding default J-14 missions...");
            await prisma.launchMission.createMany({
                data: DEFAULT_MISSIONS.map((m: any) => ({
                    title: m.title,
                    description: m.description,
                    category: m.category,
                    order: m.order,
                    importance: m.importance as any,
                }))
            });
            missions = await prisma.launchMission.findMany({
                orderBy: { order: 'asc' },
            });
        }

        return NextResponse.json({ missions }, { status: 200 });
    } catch (error) {
        console.error("Error GET Launch Missions:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { missionId, status } = await req.json();

        if (!missionId || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const validStatuses = ["TODO", "IN_PROGRESS", "DONE"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const updatedMission = await prisma.launchMission.update({
            where: { id: missionId },
            data: { status: status as MissionStatus },
        });

        return NextResponse.json({ mission: updatedMission }, { status: 200 });
    } catch (error) {
        console.error("Error PATCH Launch Mission:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
