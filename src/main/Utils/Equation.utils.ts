/**
 * Évaluateur arithmétique sécurisé (sans eval / Function), pour la saisie du champ Montant.
 *
 * Grammaire :
 *   expression := terme (('+' | '-') terme)*
 *   terme      := facteur (('*' | '/') facteur)*
 *   facteur    := ('+' | '-') facteur | nombre | '(' expression ')'
 *   nombre     := chiffres [('.' | ',') [chiffres]] | ('.' | ',') chiffres
 *
 * Les espaces (dont insécables) sont ignorés. Tout autre caractère lève une erreur.
 */

/** Longueur maximale de la saisie */
export const EQUATION_MAX_LENGTH = 100;
/** Profondeur maximale d'imbrication (parenthèses et signes unaires) */
export const EQUATION_MAX_DEPTH = 10;

const NOMBRE_REGEX = /^(?:\d+(?:[.,]\d*)?|[.,]\d+)/;
const ESPACES_REGEX = /\s/;

/**
 * Évalue une expression arithmétique.
 * @param input expression saisie (ex. "12,5 + 3 * (2 - 1)")
 * @returns résultat numérique fini
 * @throws Error si l'expression est invalide, trop longue/imbriquée, ou si le résultat n'est pas fini (ex. division par zéro)
 */
export function evaluateEquation(input: string): number {
    if (typeof input !== "string") throw new Error("Expression invalide");
    if (input.length > EQUATION_MAX_LENGTH) throw new Error("Expression trop longue");

    let pos = 0;

    const skipSpaces = (): void => {
        while (pos < input.length && ESPACES_REGEX.test(input[pos])) pos++;
    };

    const peek = (): string => {
        skipSpaces();
        return input[pos] ?? "";
    };

    const parseExpression = (depth: number): number => {
        let value = parseTerme(depth);
        for (let op = peek(); op === "+" || op === "-"; op = peek()) {
            pos++;
            const right = parseTerme(depth);
            value = op === "+" ? value + right : value - right;
        }
        return value;
    };

    const parseTerme = (depth: number): number => {
        let value = parseFacteur(depth);
        for (let op = peek(); op === "*" || op === "/"; op = peek()) {
            pos++;
            const right = parseFacteur(depth);
            if (op === "/" && right === 0) throw new Error("Division par zéro");
            value = op === "*" ? value * right : value / right;
        }
        return value;
    };

    const parseFacteur = (depth: number): number => {
        if (depth > EQUATION_MAX_DEPTH) throw new Error("Expression trop imbriquée");
        const c = peek();
        if (c === "+" || c === "-") {
            pos++;
            const v = parseFacteur(depth + 1);
            return c === "-" ? -v : v;
        }
        if (c === "(") {
            pos++;
            const v = parseExpression(depth + 1);
            if (peek() !== ")") throw new Error("Parenthèse fermante attendue");
            pos++;
            return v;
        }
        const match = NOMBRE_REGEX.exec(input.slice(pos));
        if (!match) throw new Error("Nombre attendu");
        pos += match[0].length;
        return Number(match[0].replace(",", "."));
    };

    const result = parseExpression(0);
    if (peek() !== "") throw new Error("Caractère inattendu");
    if (!Number.isFinite(result)) throw new Error("Résultat non fini");
    return result;
}
