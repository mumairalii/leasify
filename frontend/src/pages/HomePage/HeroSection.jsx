import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import ParticleBackground from "./ParticleBackground";
import {
  File,
  Mail,
  Calendar,
  BarChart2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { gsap } from "gsap";
// import { useTheme } from "@/components/ThemeProvider"; // Make sure this path is correct
import { useTheme } from "@/components/providers/ThemeProvider";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const { theme } = useTheme(); // Get current theme
  const component = useRef(null);
  const leasifyTargetRef = useRef(null);
  const particleControllerRef = useRef(null);
  const [targetCoords, setTargetCoords] = useState(null);

  const gridIcons = [
    File,
    Mail,
    Calendar,
    BarChart2,
    ShieldCheck,
    Users,
    File,
    Mail,
    Calendar,
    Users,
    ShieldCheck,
    BarChart2,
    Mail,
    File,
    Calendar,
    Users,
    File,
    ShieldCheck,
    BarChart2,
    Mail,
    Calendar,
    File,
    Mail,
    Users,
    ShieldCheck,
    BarChart2,
    Calendar,
    Mail,
    File,
    Users,
  ];

  // Reset animations when theme changes
  useEffect(() => {
    if (leasifyTargetRef.current) {
      gsap.set(leasifyTargetRef.current, {
        color: theme === "dark" ? "#ffffff" : "#000000",
        filter: "none",
      });
    }
  }, [theme]);

  useLayoutEffect(() => {
    const target = leasifyTargetRef.current;
    if (target) {
      const targetBounds = target.getBoundingClientRect();
      const componentBounds = component.current.getBoundingClientRect();
      setTargetCoords({
        x: targetBounds.left - componentBounds.left + targetBounds.width / 2,
        y: targetBounds.top - componentBounds.top + targetBounds.height / 2,
      });
    }
  }, []);

  useLayoutEffect(() => {
    if (!targetCoords) return;

    const glowColor = theme === "dark" ? "#A3E635" : "#4d7c0f"; // Different glow for light/dark

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1.0 });

      tl.to(".grid-item", {
        duration: 1.0,
        x: (i, el) => {
          const itemBounds = el.getBoundingClientRect();
          const componentBounds = component.current.getBoundingClientRect();
          const itemX =
            itemBounds.left - componentBounds.left + itemBounds.width / 2;
          return targetCoords.x - itemX;
        },
        y: (i, el) => {
          const itemBounds = el.getBoundingClientRect();
          const componentBounds = component.current.getBoundingClientRect();
          const itemY =
            itemBounds.top - componentBounds.top + itemBounds.height / 2;
          return targetCoords.y - itemY;
        },
        scale: 0,
        opacity: 0,
        ease: "power2.in",
        stagger: 0.03,
        onComplete: () => {
          gsap.set(".icon-grid-container", { visibility: "hidden" });
        },
      })
        .to(
          leasifyTargetRef.current,
          {
            color: glowColor,
            filter: `drop-shadow(0 0 15px ${glowColor}) drop-shadow(0 0 30px ${glowColor})`,
            duration: 0.4,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
            onStart: () => {
              if (particleControllerRef.current) {
                particleControllerRef.current.burst();
              }
            },
            onComplete: () => {
              // Reset to theme-appropriate color after animation
              gsap.set(leasifyTargetRef.current, {
                color: theme === "dark" ? "#ffffff" : "#000000",
                filter: "none",
              });
            },
          },
          "-=0.2"
        )
        .from(
          ["#hero-subheadline", "#hero-buttons"],
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
            stagger: 0.1,
          },
          ">-0.2"
        );
    }, component);

    return () => ctx.revert();
  }, [targetCoords, theme]);

  return (
    <section
      ref={component}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background py-24 sm:py-32"
    >
      {targetCoords && (
        <ParticleBackground
          ref={particleControllerRef}
          targetCoords={targetCoords}
          theme={theme}
        />
      )}

      <div className="relative z-10 container mx-auto px-6 text-center sm:px-8">
        <div className="mx-auto max-w-3xl">
          <h1
            id="hero-headline"
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            <span ref={leasifyTargetRef} className="relative inline-block z-20">
              Leaseify
            </span>
            , Rental Management Without the Mess.
          </h1>
          <p
            id="hero-subheadline"
            className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg"
          >
            Stop juggling spreadsheets, reminder apps, and lost emails. Leaseify
            brings your applications, payments, and maintenance requests into
            one clear, organized hub.
          </p>
          <div
            id="hero-buttons"
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button size="lg" asChild>
              <a href="#features">Learn More</a>
            </Button>

            <Link to="/register">
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-accent hover:text-accent-foreground"
              >
                Get Started For Free
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div
        className="icon-grid-container absolute inset-0 z-0 h-full w-full"
        aria-hidden="true"
      >
        <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-12 grid-rows-6 gap-4 p-8">
          {gridIcons.map((Icon, index) => (
            <div
              key={index}
              className="grid-item flex items-center justify-center"
            >
              <Icon className="h-10 w-10 text-muted-foreground/50" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

HeroSection.propTypes = {};

export default HeroSection;
// import React, { useLayoutEffect, useRef, useState } from "react";
// import PropTypes from "prop-types";
// import { Button } from "@/components/ui/button";
// import ParticleBackground from "./ParticleBackground";
// import {
//   MoveRight,
//   File,
//   Mail,
//   Calendar,
//   BarChart2,
//   ShieldCheck,
//   Users,
// } from "lucide-react";
// import { gsap } from "gsap";

// /**
//  * Renders the Hero section, featuring the "Consolidation -> Glow -> Burst" animation.
//  */
// const HeroSection = () => {
//   const component = useRef(null);
//   const leasifyTargetRef = useRef(null);
//   const particleControllerRef = useRef(null);
//   const [targetCoords, setTargetCoords] = useState(null);

//   const gridIcons = [
//     File,
//     Mail,
//     Calendar,
//     BarChart2,
//     ShieldCheck,
//     Users,
//     File,
//     Mail,
//     Calendar,
//     Users,
//     ShieldCheck,
//     BarChart2,
//     Mail,
//     File,
//     Calendar,
//     Users,
//     File,
//     ShieldCheck,
//     BarChart2,
//     Mail,
//     Calendar,
//     File,
//     Mail,
//     Users,
//     ShieldCheck,
//     BarChart2,
//     Calendar,
//     Mail,
//     File,
//     Users,
//   ];

//   // This effect runs only ONCE to get the coordinates of the "Leaseify" span.
//   useLayoutEffect(() => {
//     const target = leasifyTargetRef.current;
//     if (target) {
//       const targetBounds = target.getBoundingClientRect();
//       const componentBounds = component.current.getBoundingClientRect();
//       setTargetCoords({
//         x: targetBounds.left - componentBounds.left + targetBounds.width / 2,
//         y: targetBounds.top - componentBounds.top + targetBounds.height / 2,
//       });
//     }
//   }, []);

//   // This effect runs the animation timeline once the coordinates are ready.
//   useLayoutEffect(() => {
//     if (!targetCoords) return;

//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline({ delay: 1.0 });

//       // ACT I: The Consolidation
//       tl.to(".grid-item", {
//         duration: 1.0,
//         x: (i, el) => {
//           const itemBounds = el.getBoundingClientRect();
//           const componentBounds = component.current.getBoundingClientRect();
//           const itemX =
//             itemBounds.left - componentBounds.left + itemBounds.width / 2;
//           return targetCoords.x - itemX;
//         },
//         y: (i, el) => {
//           const itemBounds = el.getBoundingClientRect();
//           const componentBounds = component.current.getBoundingClientRect();
//           const itemY =
//             itemBounds.top - componentBounds.top + itemBounds.height / 2;
//           return targetCoords.y - itemY;
//         },
//         scale: 0,
//         opacity: 0,
//         ease: "power2.in",
//         stagger: 0.03,
//         onComplete: () => {
//           gsap.set(".icon-grid-container", { visibility: "hidden" });
//         },
//       })
//         // ACT II: The "Glow Up"
//         .to(
//           leasifyTargetRef.current,
//           {
//             color: "#A3E635",
//             filter:
//               "drop-shadow(0 0 15px #A3E635) drop-shadow(0 0 30px #A3E635)",
//             duration: 0.4,
//             yoyo: true,
//             repeat: 1,
//             ease: "power1.inOut",
//             onStart: () => {
//               // ACT III: The Particle Burst
//               if (particleControllerRef.current) {
//                 particleControllerRef.current.burst();
//               }
//             },
//           },
//           "-=0.2"
//         )
//         // Animate the sub-headline and buttons IN after the main visual event
//         .from(
//           ["#hero-subheadline", "#hero-buttons"],
//           {
//             opacity: 0,
//             y: 20,
//             duration: 0.6,
//             stagger: 0.1,
//           },
//           ">-0.2"
//         );
//     }, component);

//     return () => ctx.revert();
//   }, [targetCoords]);

//   return (
//     <section
//       ref={component}
//       className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 py-24 sm:py-32"
//     >
//       {targetCoords && (
//         <ParticleBackground
//           ref={particleControllerRef}
//           targetCoords={targetCoords}
//         />
//       )}

//       <div className="relative z-10 container mx-auto px-6 text-center sm:px-8">
//         <div className="mx-auto max-w-3xl">
//           <h1
//             id="hero-headline"
//             className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
//           >
//             <span ref={leasifyTargetRef} className="relative inline-block z-20">
//               Leaseify
//             </span>
//             , Rental Management Without the Mess.
//           </h1>
//           <p
//             id="hero-subheadline"
//             className="mt-6 text-base leading-8 text-slate-300 sm:text-lg"
//           >
//             Stop juggling spreadsheets, reminder apps, and lost emails. Leaseify
//             brings your applications, payments, and maintenance requests into
//             one clear, organized hub.
//           </p>
//           <div
//             id="hero-buttons"
//             className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
//           >
//             <Button size="lg" asChild>
//               <a href="#features">Learn More</a>
//             </Button>
//             <Button
//               size="lg"
//               variant="outline"
//               className="border-slate-400 bg-transparent text-white hover:bg-white hover:text-slate-900"
//             >
//               Are you a tenant?
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div
//         className="icon-grid-container absolute inset-0 z-0 h-full w-full"
//         aria-hidden="true"
//       >
//         <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-12 grid-rows-6 gap-4 p-8">
//           {gridIcons.map((Icon, index) => (
//             <div
//               key={index}
//               className="grid-item flex items-center justify-center"
//             >
//               <Icon className="h-10 w-10 text-slate-500" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// HeroSection.propTypes = {};

// export default HeroSection;

// import React, { useLayoutEffect, useRef, useState } from "react";
// import PropTypes from "prop-types";
// import { Button } from "@/components/ui/button";
// import ParticleBackground from "./ParticleBackground";
// import {
//   MoveRight,
//   File,
//   Mail,
//   Calendar,
//   BarChart2,
//   ShieldCheck,
//   Users,
// } from "lucide-react";
// import { gsap } from "gsap";

// /**
//  * Renders the Hero section for the Leaseify landing page.
//  * Features the "Consolidation -> Glow -> Burst" animation sequence.
//  * This version contains the fix for the infinite re-render loop.
//  */
// const HeroSection = () => {
//   const component = useRef(null);
//   const leasifyTargetRef = useRef(null);
//   const particleControllerRef = useRef(null);
//   const [targetCoords, setTargetCoords] = useState(null);

//   const gridIcons = [
//     File,
//     Mail,
//     Calendar,
//     BarChart2,
//     ShieldCheck,
//     Users,
//     File,
//     Mail,
//     Calendar,
//     Users,
//     ShieldCheck,
//     BarChart2,
//     Mail,
//     File,
//     Calendar,
//     Users,
//     File,
//     ShieldCheck,
//     BarChart2,
//     Mail,
//     Calendar,
//     File,
//     Mail,
//     Users,
//     ShieldCheck,
//     BarChart2,
//     Calendar,
//     Mail,
//     File,
//     Users,
//   ];

//   // --- THE FIX: PART 1 ---
//   // This effect runs only ONCE after the component mounts to get the coordinates.
//   useLayoutEffect(() => {
//     const target = leasifyTargetRef.current;
//     if (target) {
//       const targetBounds = target.getBoundingClientRect();
//       const componentBounds = component.current.getBoundingClientRect();
//       setTargetCoords({
//         x: targetBounds.left - componentBounds.left + targetBounds.width / 2,
//         y: targetBounds.top - componentBounds.top + targetBounds.height / 2,
//       });
//     }
//   }, []); // The empty dependency array [] ensures this runs only once.

//   // --- THE FIX: PART 2 ---
//   // This effect runs only when `targetCoords` has been set.
//   useLayoutEffect(() => {
//     // Don't run the animation until we have the coordinates.
//     if (!targetCoords) return;

//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline({ delay: 0.5 });

//       const items = gsap.utils.toArray(".grid-item");
//       gsap.set(items, { opacity: 1 }); // Ensure items are visible before animating

//       // ACT I: The Consolidation
//       tl.to(items, {
//         duration: 1.0,
//         x: (i, el) => {
//           const itemBounds = el.getBoundingClientRect();
//           const componentBounds = component.current.getBoundingClientRect();
//           const itemX =
//             itemBounds.left - componentBounds.left + itemBounds.width / 2;
//           return targetCoords.x - itemX;
//         },
//         y: (i, el) => {
//           const itemBounds = el.getBoundingClientRect();
//           const componentBounds = component.current.getBoundingClientRect();
//           const itemY =
//             itemBounds.top - componentBounds.top + itemBounds.height / 2;
//           return targetCoords.y - itemY;
//         },
//         scale: 0,
//         opacity: 0,
//         ease: "power2.in",
//         stagger: 0.03,
//         onComplete: () => {
//           // Hide the grid container after icons are gone
//           gsap.set(".icon-grid-container", { visibility: "hidden" });
//         },
//       })

//         .to(
//           leasifyTargetRef.current,
//           {
//             color: "#A3E635",
//             filter: "drop-shadow(0 0 15px #A3E635)",
//             duration: 0.3,
//             // yoyo and repeat removed to make the change permanent
//             onStart: () => {
//               if (particleControllerRef.current) {
//                 particleControllerRef.current.burst();
//               }
//             },
//           },
//           "-=0.2"
//         )
//         // ACT II: The "Glow Up"
//         // .to(
//         //   leasifyTargetRef.current,
//         //   {
//         //     color: "#A3E635",
//         //     filter: "drop-shadow(0 0 15px #A3E635)",
//         //     duration: 0.3,
//         //     yoyo: true,
//         //     repeat: 1,
//         //     onStart: () => {
//         //       // ACT III: The Particle Burst
//         //       if (particleControllerRef.current) {
//         //         particleControllerRef.current.burst();
//         //       }
//         //     },
//         //   },
//         //   "-=0.2"
//         // )
//         // Animate main text content in
//         .from(
//           ["#hero-headline", "#hero-subheadline", "#hero-buttons"],
//           {
//             opacity: 0,
//             y: 20,
//             duration: 0.6,
//             stagger: 0.1,
//           },
//           0
//         ); // Start this animation at the beginning of the timeline
//     }, component);

//     return () => ctx.revert();
//   }, [targetCoords]); // This dependency array is now safe.

//   return (
//     <section
//       ref={component}
//       className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background py-24 sm:py-32"
//     >
//       {targetCoords && (
//         <ParticleBackground
//           ref={particleControllerRef}
//           targetCoords={targetCoords}
//         />
//       )}

//       <div className="container relative z-10 mx-auto px-6 text-center sm:px-8">
//         <div className="mx-auto max-w-3xl">
//           <h1
//             id="hero-headline"
//             className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
//           >
//             <span ref={leasifyTargetRef} className="relative inline-block z-20">
//               Leaseify
//             </span>
//             , Rental Management Without the Mess.
//           </h1>
//           <p
//             id="hero-subheadline"
//             className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg"
//           >
//             Stop juggling spreadsheets, reminder apps, and lost emails. Leaseify
//             brings your applications, payments, and maintenance requests into
//             one clear, organized hub.
//           </p>
//           <div
//             id="hero-buttons"
//             className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
//           >
//             <Button size="lg">Create Your Free Account</Button>
//             <Button size="lg" variant="ghost" asChild>
//               <a href="#features">
//                 <MoveRight className="ml-2 h-4 w-4" />
//                 Are you a tenant?
//               </a>
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div
//         className="icon-grid-container absolute inset-0 z-10 h-full w-full"
//         aria-hidden="true"
//       >
//         <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-12 grid-rows-6 gap-4 p-8">
//           {gridIcons.map((Icon, index) => (
//             <div
//               key={index}
//               className="grid-item flex items-center justify-center"
//             >
//               <Icon className="h-10 w-10 text-foreground opacity-20" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// HeroSection.propTypes = {};

// export default HeroSection;
// import React, { useLayoutEffect, useRef } from "react";
// import PropTypes from "prop-types";
// import { Button } from "@/components/ui/button";
// import {
//   MoveRight,
//   File,
//   Mail,
//   Calendar,
//   BarChart2,
//   ShieldCheck,
//   Users,
// } from "lucide-react";
// import { gsap } from "gsap";

// /**
//  * Renders the Hero section for the Leaseify landing page.
//  * Features the "Great Consolidation" animation where background icons are "absorbed"
//  * into the brand name, visually representing the software's purpose.
//  */
// const HeroSection = () => {
//   const component = useRef(null);
//   const leasifyTargetRef = useRef(null); // A ref for our target word

//   const gridIcons = [
//     File,
//     Mail,
//     Calendar,
//     BarChart2,
//     ShieldCheck,
//     Users,
//     File,
//     Mail,
//     Calendar,
//     Users,
//     ShieldCheck,
//     BarChart2,
//     Mail,
//     File,
//     Calendar,
//     Users,
//     File,
//     ShieldCheck,
//     BarChart2,
//     Mail,
//     Calendar,
//     File,
//     Mail,
//     Users,
//     ShieldCheck,
//     BarChart2,
//     Calendar,
//     Mail,
//     File,
//     Users,
//   ];

//   useLayoutEffect(() => {
//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline({ delay: 0.5 });

//       // Animate the text and icons into view first
//       tl.from(["#hero-headline", ".grid-item"], {
//         opacity: 0,
//         y: 20,
//         duration: 0.8,
//         ease: "power3.out",
//         stagger: 0.03,
//       });

//       // Then, after a pause, start the consolidation animation
//       tl.add(() => {
//         const target = leasifyTargetRef.current;
//         const items = gsap.utils.toArray(".grid-item");

//         if (!target) return;

//         // Get the position of the target span
//         const targetBounds = target.getBoundingClientRect();
//         const targetX = targetBounds.left + targetBounds.width / 2;
//         const targetY = targetBounds.top + targetBounds.height / 2;

//         items.forEach((item) => {
//           const itemBounds = item.getBoundingClientRect();
//           const itemX = itemBounds.left + itemBounds.width / 2;
//           const itemY = itemBounds.top + itemBounds.height / 2;

//           // Animate each item to the target's position
//           gsap.to(item, {
//             x: targetX - itemX,
//             y: targetY - itemY,
//             scale: 0,
//             opacity: 0,
//             duration: 1.2,
//             ease: "power3.in",
//             delay: Math.random() * 0.5, // Add a random delay for a more organic feel
//           });
//         });
//       }, "+=0.5"); // Start this animation 0.5s after the intro animation finishes

//       // Animate the sub-headline and buttons after the consolidation is complete
//       tl.from(
//         ["#hero-subheadline", "#hero-buttons"],
//         {
//           opacity: 0,
//           y: 20,
//           duration: 0.6,
//         },
//         ">-0.2"
//       ); // Start this slightly before the previous animation ends
//     }, component);

//     return () => ctx.revert();
//   }, []);

//   return (
//     // <section
//     //   ref={component}
//     //   className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background py-24 sm:py-32"
//     // >
//     //   <div className="container relative z-10 mx-auto px-6 text-center sm:px-8">
//     //     <div className="mx-auto max-w-3xl">
//     //       <h1
//     //         id="hero-headline"
//     //         className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
//     //       >
//     //         {/* The ref is on the span to make it the target */}
//     //         <span ref={leasifyTargetRef} className="relative inline-block">
//     //           Leaseify
//     //         </span>
//     //         , Rental Management Without the Mess.
//     //       </h1>
//     //       <p
//     //         id="hero-subheadline"
//     //         className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg"
//     //       >
//     //         Stop juggling spreadsheets, reminder apps, and lost emails. Leaseify
//     //         brings your applications, payments, and maintenance requests into
//     //         one clear, organized hub.
//     //       </p>
//     //       <div
//     //         id="hero-buttons"
//     //         className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
//     //       >
//     //         <Button size="lg">Create Your Free Account</Button>
//     //         <Button size="lg" variant="ghost" asChild>
//     //           <a href="#features">
//     //             <MoveRight className="ml-2 h-4 w-4" />
//     //             Are you a tenant?
//     //           </a>
//     //         </Button>
//     //       </div>
//     //     </div>
//     //   </div>

//     //   <div
//     //     className="absolute inset-0 z-0 flex items-center justify-center opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
//     //     aria-hidden="true"
//     //   >
//     //     <div className="grid h-[300px] w-[500px] grid-cols-10 grid-rows-3 gap-4">
//     //       {gridIcons.map((Icon, index) => (
//     //         <div
//     //           key={index}
//     //           className="grid-item flex items-center justify-center"
//     //         >
//     //           <Icon className="h-8 w-8 text-foreground" />
//     //         </div>
//     //       ))}
//     //     </div>
//     //   </div>
//     // </section>
//     <section
//       ref={component}
//       className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background py-24 sm:py-32"
//     >
//       <div className="container relative z-10 mx-auto px-6 text-center sm:px-8">
//         <div className="mx-auto max-w-3xl">
//           <h1
//             id="hero-headline"
//             className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
//           >
//             <span ref={leasifyTargetRef} className="relative inline-block">
//               Leaseify
//             </span>
//             , Rental Management Without the Mess.
//           </h1>
//           <p
//             id="hero-subheadline"
//             className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg"
//           >
//             Stop juggling spreadsheets, reminder apps, and lost emails. Leaseify
//             brings your applications, payments, and maintenance requests into
//             one clear, organized hub.
//           </p>
//           <div
//             id="hero-buttons"
//             className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
//           >
//             <Button size="lg">Create Your Free Account</Button>
//             <Button size="lg" variant="ghost" asChild>
//               <a href="#features">
//                 <MoveRight className="ml-2 h-4 w-4" />
//                 Are you a tenant?
//               </a>
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* --- CHANGE: This container now spans the full screen --- */}
//       <div className="absolute inset-0 z-0 h-full w-full" aria-hidden="true">
//         {/* The grid now fills its parent container, spreading the icons out */}
//         <div className="grid h-full w-full grid-cols-12 grid-rows-6 gap-4 p-8">
//           {gridIcons.map((Icon, index) => (
//             <div
//               key={index}
//               className="grid-item flex items-center justify-center"
//             >
//               {/* --- CHANGE: Icons are now larger --- */}
//               <Icon className="h-10 w-10 text-foreground opacity-20" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// HeroSection.propTypes = {};

// export default HeroSection;
