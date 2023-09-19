import {UIX} from "uix";

import { GameView } from "common/GameView.tsx";
import { Datex } from "unyt_core/datex.ts";

UIX.Theme.setMode("dark")
Datex.Compiler.SIGN_DEFAULT = false;

export default {
	'/join': UIX.once(() => <GameView/>)
} satisfies UIX.Entrypoint