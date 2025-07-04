import React, { useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Autoplay from "embla-carousel-autoplay"; // Import the plugin

gsap.registerPlugin(ScrollTrigger);

/**
 * Renders the "Social Proof" section with a carousel of user testimonials.
 * The section gracefully animates into view as the user scrolls.
 */
const SocialProofSection = () => {
  const component = useRef(null);
  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  ); // Configure autoplay

  const testimonials = [
    {
      name: "Mark R.",
      role: "Part-time Landlord",
      imageSrc: "https://i.pravatar.cc/150?u=mark",
      quote:
        "Before Leaseify, my records were a disaster of spreadsheets and notes. Now, everything is in one place. I feel more like a savvy investor and less like a stressed-out administrator. It's given me my weekends back.",
    },
    {
      name: "Sarah J.",
      role: "Tenant",
      imageSrc: "https://i.pravatar.cc/150?u=sarah",
      quote:
        "It's so refreshing to have a landlord who uses a modern system. Paying rent takes ten seconds on my phone, and when our faucet leaked, I submitted a request and could see its status. It's just simple and professional.",
    },
    {
      name: "David Chen",
      role: "Owner, 3 Properties",
      imageSrc: "https://i.pravatar.cc/150?u=david",
      quote:
        "The payment tracking alone is worth it. I know exactly who has paid and who is late without ever having to check my bank statement or send an awkward text. It has completely streamlined my cash flow.",
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: component.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      tl.from("#testimonials-headline", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power3.out",
      }).from(
        "#testimonials-carousel",
        {
          // Target the entire carousel module
          opacity: 0,
          y: 30,
          scale: 0.98,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.3"
      );
    }, component);
    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <section
      ref={component}
      id="testimonials"
      className="py-20 sm:py-28 animated-gradient-background"
    >
      <div className="container mx-auto px-6 sm:px-8 md:px-6">
        <div
          id="testimonials-headline"
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by Landlords and Tenants Like You.
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Real stories from people who have simplified their rental world.
          </p>
        </div>

        <Carousel
          id="testimonials-carousel"
          plugins={[autoplayPlugin.current]} // Add the plugin here
          onMouseEnter={autoplayPlugin.current.stop} // Pause on hover
          onMouseLeave={autoplayPlugin.current.reset} // Resume on leave
          opts={{ align: "start", loop: true }}
          className="mx-auto mt-16 w-full max-w-3xl"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.name}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-8 text-center md:p-12">
                      <Avatar className="mb-6 h-24 w-24 border-2 border-primary/10">
                        <AvatarImage
                          src={testimonial.imageSrc}
                          alt={`Photo of ${testimonial.name}`}
                        />
                        <AvatarFallback>
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <blockquote className="max-w-xl text-lg font-medium leading-relaxed text-foreground">
                        “{testimonial.quote}”
                      </blockquote>
                      <cite className="mt-6 block text-base not-italic text-muted-foreground">
                        — {testimonial.name}, {testimonial.role}
                      </cite>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

SocialProofSection.propTypes = {};

export default SocialProofSection;
