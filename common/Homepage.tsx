import { IEL, UIX } from "uix/uix.ts";
import { unytArtwallOpenGraphImageGenerator } from "./UnytOpenGraphImageGenerator.tsx";

@Component({
	border: 0,
	padding: 0,
	title: "unyt.org Artwall",
	description: "The collaborative art project for unyt.org trade shows and events"
})
export class Homepage extends UIX.Components.Base {
	override openGraphImageGenerator = unytArtwallOpenGraphImageGenerator;

	@content main = <div>
		<h1>Artwall</h1>
		<a href="/join">{IEL`fa-pen`} Join!</a>
	</div>
}