export function isConstructor(obj : any) : obj is (new (...args: []) => any) {
  return (
    typeof obj?.prototype?.constructor === "function" &&
    typeof obj?.prototype?.constructor.name === "string"
  );
}