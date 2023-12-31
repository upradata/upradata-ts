import { assignRecursive } from '@upradata/useful';
import fs from 'fs-extra';
import ts from 'typescript';
import { defaultTscOptions } from './tsc';


function getExternalModuleName(node: ts.Node): ts.Expression | undefined {
    if (node.kind === ts.SyntaxKind.ImportDeclaration) {
        return (node as ts.ImportDeclaration).moduleSpecifier;
    }
    if (node.kind === ts.SyntaxKind.ImportEqualsDeclaration) {
        const reference = (node as ts.ImportEqualsDeclaration).moduleReference;
        if (reference.kind === ts.SyntaxKind.ExternalModuleReference) {
            return (reference as ts.ExternalModuleReference).expression;
        }
    }

    if (node.kind === ts.SyntaxKind.ExportDeclaration) {
        return (node as ts.ExportDeclaration).moduleSpecifier;
    }
}

const isImportOrExport = (node: ts.Node) =>
    node.kind === ts.SyntaxKind.ImportDeclaration ||
    node.kind === ts.SyntaxKind.ImportEqualsDeclaration ||
    node.kind === ts.SyntaxKind.ExportDeclaration;


function getSourceDependencies(sourceFile: ts.SourceFile, checker: ts.TypeChecker) {
    const depsSymbols: ts.Symbol[] = [];

    /* if (sourceFile.fileName !== '/home/milottit/Libraries/Util/node-util/caca.ts')
        return [];
    console.log(sourceFile.fileName);
    console.log((sourceFile as any).imports);
    console.log((sourceFile as any).symbol.exports); */

    ts.forEachChild(sourceFile, node => {
        // Vist top-level import nodes
        // console.log(node.getText(), node.kind, node);
        if (isImportOrExport(node)) {
            const moduleNameExpr = getExternalModuleName(node);

            // if they have a name, that is a string, i.e. not alias definition `import x = y`
            if (moduleNameExpr && moduleNameExpr.kind === ts.SyntaxKind.StringLiteral) {
                // Ask the checker about the "symbol: for this module name
                // it would be undefined if the module was not found (i.e. error)
                const moduleSymbol = checker.getSymbolAtLocation(moduleNameExpr);

                if (moduleSymbol)
                    depsSymbols.push(moduleSymbol);
            }
        }
    });
    return depsSymbols;
}

export const getDependencies = (sourceFiles: string[], options?: { compiler?: ts.CompilerOptions; filter?: (filepath: string) => boolean; }) => {
    const opts = assignRecursive({ filter: (_file: string) => true, compiler: { ...defaultTscOptions, emitDeclarationOnly: true } }, options);
    const deps: string[] = [];

    const program = ts.createProgram(sourceFiles, opts.compiler!);

    const sources = program.getSourceFiles().filter(s => opts.filter!(s.fileName));

    for (const sourceFile of sources) {
        const depSymbols = getSourceDependencies(sourceFile, program.getTypeChecker());

        for (const importSymbol of depSymbols) {
            // Now that you have a symbol, get the declaration to find out which
            // source file it is comming from.
            const declaration = importSymbol.getDeclarations()![ 0 ];

            // This might be helpful if you are doing bundelling, you would want to
            // know if this comming from a .d.ts e.g. `declare module "typescript`
            // or a real source file (.ts).
            //  const isCodeModule = declaration.kind === ts.SyntaxKind.SourceFile && !sourceFile.isDeclarationFile;
            const filepath = declaration.getSourceFile().fileName;
            const stem = filepath.replace(/(\.d)?\.ts/, '');
            const filepathJsAndTs = [ 'js', 'ts' ].map(ext => `${stem}.${ext}`);

            for (const file of filepathJsAndTs) {
                if (opts.filter!(filepath) && fs.existsSync(file))
                    deps.push(file);
            }
            // console.log(`   --> ${declaration.getSourceFile().fileName}  (isCodeModule = ${isCodeModule})`);
        };
    };

    return deps;
};



// console.log(getDependencies([ '/home/milottit/Libraries/Tilda/tools/test/scripts/global/js/index.entry.ts' ]));
// console.log('\n', '2222', '\n');
// console.log(getDependencies([ '/home/milottit/Libraries/Tilda/tools/test/scripts/local/html/language/language.ts' ]));
// console.log(getDependencies([ '/home/milottit/Libraries/Util/node-util/caca.ts' ]));
// console.log(getDependencies([ '/home/milottit/Libraries/Util/node-util/pipi.ts' ], { filter: (f: string) => !f.includes('node_modules') }));
