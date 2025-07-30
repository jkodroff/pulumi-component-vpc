import { LocalWorkspace } from "@pulumi/pulumi/automation";

export async function runTest(testDir: string): Promise<boolean> {
  const stackName = "integration-test";
  let pass = true;

  const stack = await LocalWorkspace.createOrSelectStack({
    stackName: stackName,
    workDir: testDir,
  });

  // Add a Pulumi ESC environment to the configuration to allow for dynamic
  // cloud credentials:
  stack.addEnvironments("aws/aws-oidc-admin");

  const fullyQualifiedStackName = "${stack.workspace.projectSettings.name}/${stack.name}";
  console.log(`Creating stack "${fullyQualifiedStackName}" from program in directory "${testDir}."`);
  try {
    await stack.up({ onOutput: console.log });
  }
  catch (e) {
    if (e instanceof Error) {
      console.log(`Stack update failed: ${e.message}`);
    } else {
      console.log("Stack update failed. Unknown error.");
    }
    pass = false;
  }
  finally {
    console.log(`Destroying stack ${fullyQualifiedStackName}.`);
    try {
      await stack.destroy({ onOutput: console.log });
    }
    catch {
      console.log("Stack destroy failed. You will need to ensure that all stack resources were removed.");
      pass = false;
    }
    finally {
      return pass;
    }
  }
}

runTest("test-cases/basic");
