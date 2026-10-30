import { act, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithLanguage } from "@/test/render";
import { worldStore } from "@/world/store";
import { NavPill } from "./NavPill";

beforeEach(() => {
  worldStore.reset();
  worldStore.setPhase("running");
});

describe("NavPill", () => {
  it("names the next gate and its distance, then confirms completion", () => {
    renderWithLanguage(<NavPill />);
    act(() => worldStore.setNav({ key: "profile", distance: 47 }));
    expect(screen.getByText("Profile in 47 m")).toBeInTheDocument();
    act(() => worldStore.setNav(null));
    expect(screen.getByText("All gates visited")).toBeInTheDocument();
  });
});
