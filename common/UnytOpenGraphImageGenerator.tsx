import { Path } from "unyt_node/path.ts";
import { OpenGraphPreviewImageGenerator } from "uix/base/open_graph.ts";

export const unytArtwallOpenGraphImageGenerator: OpenGraphPreviewImageGenerator = {
	getImageURL() {
		return new Path("./res/og-preview/artwall.png")
	}
};