"use client";
import Link from "next/link";
import React from "react";
import Icon from "@/components/icon";
import { useRouter } from "next/navigation";

const GoBack = ({ title }: { title: string }) => {
    const router = useRouter();

    return (
        <header className="z-50 w-full bg-ui-light max-h-16">
            <div className="container mx-auto px-2 md:px-0 flex h-14 items-center">
                <div className="flex gap-3 items-center justify-start">
                    {/* Go Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center space-x-2"
                    >
                        <Icon name="IoChevronBackOutline" className="h-6 w-6" />
                    </button>

                    {/* Title */}
                    <span className="text-xl font-medium">{title}</span>
                </div>
            </div>
        </header>
    );
};

export default GoBack;
