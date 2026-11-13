import { ViewTransition } from "react";

import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Stack } from "@/components/sections/stack";
import { Work } from "@/components/sections/work";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";

/**
 * Homepage — sections are server components; a few small client islands
 * live inside them (the work index's hover/focus preview, the copy-email
 * control and the local clock). The page transition and every other
 * motion cue are authored CSS, switched on by the motion director.
 *
 * Order is the pitch order for freelance clients (primary audience):
 * proof -> what I take on -> how it runs -> with what -> who -> how to
 * reach me. The featured projects show here; the full index is /work.
 */
export default function Home() {
  return (
    <ViewTransition
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      default="none"
    >
      <div className="flex flex-col">
        {/* Mobile pitch order: hero -> process (the differentiator) -> work ->
            services -> stack -> about -> contact. Desktop keeps proof first:
            hero -> work -> services -> process -> stack -> about -> contact. */}
        <div className="order-1 lg:order-1"><Hero /></div>
        <div className="order-2 lg:order-4"><Process /></div>
        <div className="order-3 lg:order-2"><Work /></div>
        <div className="order-4 lg:order-3"><Services /></div>
        <div className="order-5"><Stack /></div>
        <div className="order-6"><About /></div>
        <div className="order-7"><Contact /></div>
      </div>
    </ViewTransition>
  );
}
