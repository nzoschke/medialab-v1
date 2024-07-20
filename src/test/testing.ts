import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";

export const assertT = (actual: unknown, message?: string) => {
  expect(actual, message).toBeTruthy();
};

export const assertF = (actual: unknown, message?: string) => {
  expect(actual, message).toBeFalsy();
};

export const click = async (element: HTMLElement) => {
  // TODO: move off deprecated direct APIs per https://testing-library.com/docs/user-event/setup/#direct-apis
  await userEvent.click(element);
};

export const getByRole = (role: string, name: string) => {
  return screen.getByRole(role, { name });
};

export const getByText = (text: string) => {
  return screen.getByText(text);
};

export const getAllByText = (text: string) => {
  return screen.getAllByText(text);
};

export const user = () => {
  return userEvent.setup();
};

export const setup = (Component: any, options?: any) => {
  render(Component, options);

  return {
    screen,
    user: userEvent.setup(),
  };
};
