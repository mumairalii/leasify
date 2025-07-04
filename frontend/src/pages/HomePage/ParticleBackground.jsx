import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import PropTypes from "prop-types";
import { gsap } from "gsap";

const useParticleAnimation = (canvasRef, isReady, targetCoords) => {
  const particlesArray = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isReady) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // --- FIX: The Particle class is now defined at the top of the effect ---
    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.opacity = 1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(163, 230, 53, ${this.opacity})`; // Use glow color with opacity
        ctx.fill();
      }
      update() {
        if (this.x > canvas.width || this.x < 0)
          this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0)
          this.directionY = -this.directionY;
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    const init = () => {
      particlesArray.current = [];
      let numberOfParticles = (canvas.height * canvas.width) / 5000;
      for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 2 + 1;
        let x = targetCoords.x;
        let y = targetCoords.y;
        let directionX = Math.random() * 0.4 - 0.2;
        let directionY = Math.random() * 0.4 - 0.2;
        let color = "rgba(163, 230, 53, 1)";
        // This is now safe because Particle class is already defined
        particlesArray.current.push(
          new Particle(x, y, directionX, directionY, size, color)
        );
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (let particle of particlesArray.current) {
        particle.update();
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasRef, isReady, targetCoords]);

  const burst = () => {
    particlesArray.current.forEach((particle) => {
      gsap.to(particle, {
        x: particle.x + (Math.random() - 0.5) * window.innerWidth * 1.2,
        y: particle.y + (Math.random() - 0.5) * window.innerHeight * 1.2,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        duration: 2.5,
        ease: "power4.out",
      });
    });
  };

  return { burst };
};

const ParticleBackground = forwardRef(({ targetCoords }, ref) => {
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = React.useState(false);
  const controller = useParticleAnimation(canvasRef, isReady, targetCoords);

  useImperativeHandle(ref, () => ({
    burst() {
      controller.burst();
    },
  }));

  useEffect(() => {
    if (targetCoords) {
      setIsReady(true);
    }
  }, [targetCoords]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0"
    ></canvas>
  );
});

ParticleBackground.displayName = "ParticleBackground";
ParticleBackground.propTypes = { targetCoords: PropTypes.object };

export default ParticleBackground;
