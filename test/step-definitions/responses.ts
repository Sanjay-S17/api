import { binding, then, before } from 'cucumber-tsflow';
import { expect } from 'chai';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import Context from '../support/world';
import { ValidationPipe } from '@nestjs/common';

@binding([Context])
export class responses {
  constructor(protected context: Context) {}

  @before()
  public async before(): Promise<void> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.context.app = moduleFixture.createNestApplication();
    this.context.app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await this.context.app.init();
  }

  @then(/the response status code should be (200|201|400|401|404|413|500|503)/)
  public statusResponse(status: string) {
    expect(this.context.response.status).to.equal(parseInt(status));
  }

  @then(/the response should be "([^"]*)"/)
  public dataResponse(data: string) {
    expect(this.context.response.text).to.equal(data);
  }

  @then(/the response in property "([^"]*)" should contain:/)
  public dataResponseItemTable(item: number, table: { rawTable: [] }) {
    const data = this.context.tableToObject(table);
    Object.keys(data).forEach((key) => {
      expect(JSON.parse(this.context.response.text)[item][key]).to.eql(
        data[key],
      );
    });
  }

  @then(/the response in property "([^"]*)" and item "([^"]*)" should contain:/)
  public dataResponsePropertyItemTable(
    property: string,
    item: number,
    table: { rawTable: [] },
  ) {
    const data = this.context.tableToObject(table);
    console.log(JSON.parse(this.context.response.text)[property][item]);
    console.log(data);
    Object.keys(data).forEach((key) => {
      expect(
        JSON.parse(this.context.response.text)[property][item][key],
      ).to.eql(data[key]);
    });
  }

  @then(/the response property "([^"]*)" has items:/)
  public dataResponsePropertyTable(property: string, table: { rawTable: [] }) {
    const data = this.context.tableToArray(table);
    expect(JSON.parse(this.context.response.text)[property]).to.eql(data);
  }

  @then(/the response should contain:/)
  public dataResponseTable(table: { rawTable: [] }) {
    const data = this.context.tableToObject(table);
    Object.keys(data).forEach((key) =>
      expect(JSON.parse(this.context.response.text)[key]).to.eql(data[key]),
    );
  }
}
