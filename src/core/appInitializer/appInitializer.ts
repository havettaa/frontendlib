export function appInitFactory(primaryDependency: Function
    ): () => Promise<any> {
      return (): Promise<void> => {
        return new Promise((resolve, reject) => {
            primaryDependency[0]()
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject();
            });
        });
      };
    }