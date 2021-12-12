
export namespace Util {
    export function removeLastSegmentsFromPath(path: string, numberOfSegmentsToRemove: number) {
        const segments = path.split('/');
        const segmentsLength = segments.length;

        segments.length = segmentsLength - numberOfSegmentsToRemove;
        return segments.join('/');
    }
}
