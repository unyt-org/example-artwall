import { Path } from "uix/utils/path.ts";
import { OpenGraphPreviewImageGenerator } from "uix/base/open-graph.ts";

export const unytArtwallOpenGraphImageGenerator: OpenGraphPreviewImageGenerator = {
	getImageURL() {
		return new Path("./res/og-preview/artwall.png")
	}
};