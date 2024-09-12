"use client";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);
// ConvexProvider
const ConvexClerkProvider = ({ children }: { children: ReactNode }) => {
    return (
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
            appearance={{
                layout: {
                    socialButtonsVariant: "blockButton", // "iconButton"| 'blockButton'
                    logoImageUrl: "/icons/logo.svg",
                },
                variables: {
                    colorBackground: '#15171c',
                    colorPrimary: '',
                    colorText: '#fff',
                    colorInputBackground: 'rgba(255, 255, 255, 0.1)',
                    colorInputText: '#fff',
                    colorNeutral: '#fff',
                },
                elements: {
                    button: {
                        backgroundColor: '#353535',
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: '#5D5D5D',
                        }
                    },
                }
            }}
        >
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}

export default ConvexClerkProvider;
/** 기존 코드 
 * "use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
 */