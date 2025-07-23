import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";

export interface VpcArgs {
}

export class Vpc extends pulumi.ComponentResource {
  public readonly Vpc: awsx.ec2.Vpc;

  constructor(name: string, args: VpcArgs, opts?: pulumi.ComponentResourceOptions) {
    super("jkodroff:index:Vpc", name, args, opts);

    this.Vpc = new awsx.ec2.Vpc(name);

    this.registerOutputs();
  }
}

