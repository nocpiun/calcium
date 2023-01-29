import ComputeWorker from "../workers/compute.worker.ts";

import List from "./List";
import Queue from "./Queue";
import type {
    WorkerRequest,
    WorkerResponse,
    PromiseExecutor,
    WorkerInfo
} from "../types";

export default class WorkerPool {
    private idleWorkers: List<Worker> = new List();
    private workerQueue: Queue<WorkerInfo> = new Queue();
    private workers: Map<Worker, PromiseExecutor> = new Map();
    
    public constructor(workerAmount: number) {
        for(let i = 0; i < workerAmount; i++) {
            let worker = new ComputeWorker();
            worker.addEventListener("message", (e) => {
                this.workerDone(worker, e.data);
            });
            worker.addEventListener("error", (e) => {
                this.workerDone(worker, null, e.error);
            });

            this.idleWorkers.add(worker);
        }
    }

    private workerStart(worker: Worker, workerInfo: WorkerInfo): void {
        var { workData, resolve, reject } = workerInfo;

        this.workers.set(worker, { resolve, reject });
        worker.postMessage(workData);
    }

    private workerDone(worker: Worker, response: WorkerResponse | null, error?: any): void {
        var executor = this.workers.get(worker);
        if(!executor) return;
        var { resolve, reject } = executor;

        this.workers.delete(worker);

        if(this.workerQueue.isEmpty()) {
            this.idleWorkers.add(worker);
        } else {
            this.workerStart(worker, this.workerQueue.dequeue());
        }

        response ? resolve(response) : reject(error);
    }

    public addWorker(workData: WorkerRequest): Promise<WorkerResponse> {
        return new Promise((resolve, reject) => {
            if(!this.idleWorkers.isEmpty()) {
                var worker = this.idleWorkers.value.pop();
                if(!worker) return;

                this.workerStart(worker, { workData, resolve, reject });
            } else {
                this.workerQueue.enqueue({ workData, resolve, reject });
            }
        });
    }

    public terminateAllWorkers(): void {
        // Idle Workers
        this.idleWorkers.forEach((worker) => worker.terminate());
        // Working Workers
        this.workers.forEach((executor, worker) => worker.terminate());
    }
}
