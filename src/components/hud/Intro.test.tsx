import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithLanguage } from "@/test/render";
import { worldStore } from "@/world/store";

const env = vi.hoisted(() => ({ webgl: true, reduce: false }));
vi.mock("@/hooks/useWebGLSupport", () => ({ useWebGLSupport: () => env.webgl }));
vi.mock("@/hooks/usePrefersReducedMotion", () => ({ usePrefersReducedMotion: () => env.reduce }));

import { Intro } from "./Intro";

beforeEach(() => {
  env.webgl = true;
  env.reduce = false;
  worldStore.setPhase("intro");
});

describe("Intro", () => {
  it("server-renderable intro with real content and both entry points", () => {
    renderWithLanguage(<Intro hidden={false} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Explore the portfolio of Miftahul Huda");
    expect(screen.getByRole("link", { name: "View compact version ↗" })).toHaveAttribute("href", "/ringkas");
    expect(screen.getByRole("button", { name: "Start exploring →" })).toBeInTheDocument();
  });

  it("start moves the world to loading", async () => {
    renderWithLanguage(<Intro hidden={false} />);
    await userEvent.click(screen.getByRole("button", { name: "Start exploring →" }));
    expect(worldStore.getState().phase).toBe("loading");
    expect(screen.getByRole("button", { name: "Loading the city…" })).toBeDisabled();
  });

  it("without WebGL offers only the compact version", () => {
    env.webgl = false;
    renderWithLanguage(<Intro hidden={false} />);
    expect(screen.getByText(/does not support 3D graphics/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /start exploring/i })).not.toBeInTheDocument();
  });

  it("with reduced motion recommends the compact version first", () => {
    env.reduce = true;
    renderWithLanguage(<Intro hidden={false} />);
    expect(screen.getByText(/Reduced motion is enabled/)).toBeInTheDocument();
    const links = screen.getAllByRole("link");
    const start = screen.getByRole("button", { name: /start exploring/i });
    expect(links[0].compareDocumentPosition(start) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("is inert while hidden", () => {
    const { container } = renderWithLanguage(<Intro hidden />);
    expect(container.querySelector("section")).toHaveAttribute("inert");
  });

  it("failed load shows retry", () => {
    worldStore.setPhase("failed");
    renderWithLanguage(<Intro hidden={false} />);
    expect(screen.getByRole("button", { name: "The city could not be loaded. Try again →" })).toBeEnabled();
  });
});
