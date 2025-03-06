'use server'

import {getServerSession} from "next-auth";
import {authOptions} from "@/auth";
import {AnnualWheel, AnnualWheelWithEvents} from "@/types/AnnualWheel";
import {createAnnualWheel, getAnnualWheelById, updateAnnualWheel} from "@/data/AnnualWheel";

export async function createAnnualWheelAction(body: Partial<AnnualWheel>) {
    const session: any = await getServerSession(authOptions);

    if (!session) {
        return { message: "Unauthorized",  status: 401 };
    }

    try {
        if (!body.name || body.name.trim() === "") {
            return { message: "Annual Wheel name is required." , status: 400 };
        }

        if (!body.year || isNaN(body.year)) {
            return { message: "Valid year is required.", status: 400 };
        }

        const id = await createAnnualWheel(body.name, body.description ?? null, session.user.id, body.year);
        const annualWheel = await getAnnualWheelById(id);

        return {annualWheel, status: 201 };
    } catch (error: any) {
        console.error("Error creating Annual Wheel:", error);
        return { message: "Internal Server Error.", status: 500 };
    }
}

export async function updateAnnualWheelAction(body: AnnualWheelWithEvents) {
    const session: any = await getServerSession(authOptions);

    if (!session) {
        return { message: "Unauthorized",  status: 401 };
    }

    try {

        if (body.userId != session.user.id) {
            return { message: "Unauthorized",  status: 401 };
        }

        // Basic validation
        if (!body.name || body.name.trim() === "") {
            return { message: "Annual Wheel name is required.", status: 400 };
        }

        if (!body.year || isNaN(body.year)) {
            return { message: "Valid year is required.", status: 400 };
        }

        await updateAnnualWheel(
            body.id,
            body);

        const updated = await getAnnualWheelById(body.id);

        return {data: updated, status: 201 };
    } catch (error: any) {
        console.error("Error updating annual Wheel:", error);
        return { message: "Internal Server Error.", status: 500 };
    }
}