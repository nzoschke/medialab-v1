import { assert, expect, test } from "vitest";
import fs from "node:fs";
import type { Message, Phrase } from "@components/meta/analysis";

test("Math.sqrt()", () => {
  expect(Math.sqrt(4)).toBe(2);
  expect(Math.sqrt(144)).toBe(12);
  expect(Math.sqrt(2)).toBe(Math.SQRT2);
});

test("JSON", () => {
  const input = {
    foo: "hello",
    bar: "world",
  };

  const output = JSON.stringify(input);

  expect(output).eq('{"foo":"hello","bar":"world"}');
  assert.deepEqual(JSON.parse(output), input, "matches original");
});

test("analysis", () => {
  const msgs = JSON.parse(fs.readFileSync("public/influence.json", "utf8")) as Message[];

  const syss = msgs.filter((msg) => msg.type == "sys");
  expect(syss.length).toBe(2);
  expect(syss[1].ms).toBeCloseTo(mmss("04:16.1"), -3);

  const phrases = msgs.filter((msg) => msg.type == "phrase");
  expect(phrases.length).toBe(17);

  let phrase = phrases[0];
  expect(ph(phrase).beat).toBe(bb("1.1"));
  expect(ph(phrase).ms).toBeCloseTo(mmss("00:00.0"), -3);

  phrase = phrases[1];
  expect(ph(phrase).beat).toBe(bb("10.1"));
  expect(ph(phrase).ms).toBeCloseTo(mmss("00:16.4"), -3);

  phrase = phrases[2];
  expect(ph(phrase).beat).toBe(bb("13.1"));
  expect(ph(phrase).ms).toBeCloseTo(mmss("00:21.7"), -3);

  phrase = phrases[3];
  expect(ph(phrase).beat).toBe(bb("33.1"));
  expect(ph(phrase).ms).toBeCloseTo(mmss("00:57.3"), -3);

  phrase = phrases[16];
  expect(ph(phrase).beat).toBe(bb("133.1"));
  expect(ph(phrase).ms).toBeCloseTo(mmss("03:55.2"), -4);
});

const ph = (msg: Message) => {
  const p = msg.payload as Phrase;
  return {
    beat: p.beat,
    kind: p.kind,
    ms: msg.ms,
  };
};

const mmss = (s: string) => {
  const parts = s.split(".");
  const ms = (parseInt(parts[1]) / 10) * 1000; // 1/10th of a second
  const mmss = parts[0].split(":").map((p) => parseInt(p));
  return (mmss[0] * 60 + mmss[1]) * 1000 + ms;
};

const bb = (bb: string) => {
  const parts = bb.split(".").map((p) => parseInt(p));
  return (parts[0] - 1) * 4 + parts[1];
};
