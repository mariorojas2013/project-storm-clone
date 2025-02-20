import { BaseModel, BaseModelGenerics, BaseModelOptions } from '../../core-models/BaseModel';
import { CanvasModel } from '../canvas/CanvasModel';
import _flatMap from 'lodash/flatMap';
import _forEach from 'lodash/forEach';
import _mapValues from 'lodash/mapValues';
import { CanvasEngine } from '../../CanvasEngine';
import { FactoryBank } from '../../core/FactoryBank';
import { AbstractModelFactory } from '../../core/AbstractModelFactory';
import { DeserializeEvent } from '../../core-models/BaseEntity';

export interface LayerModelOptions extends BaseModelOptions {
	isSvg?: boolean;
	transformed?: boolean;
}

export interface LayerModelGenerics extends BaseModelGenerics {
	OPTIONS: LayerModelOptions;
	PARENT: CanvasModel;
	CHILDREN: BaseModel;
	ENGINE: CanvasEngine;
}

export abstract class LayerModel<G extends LayerModelGenerics = LayerModelGenerics> extends BaseModel<G> {
	protected models: { [id: string]: G['CHILDREN'] };
	protected repaintEnabled: boolean;

	constructor(options: G['OPTIONS'] = {}) {
		super(options);
		this.models = {};
		this.repaintEnabled = true;
	}

	/**
	 * This is used for deserialization
	 */
	abstract getChildModelFactoryBank(engine: G['ENGINE']): FactoryBank<AbstractModelFactory<BaseModel>>;

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.options.isSvg = !!event.data.isSvg;
		this.options.isWorktable = !!event.data.isWorktable;
		this.options.transformed = !!event.data.transformed;
		_forEach(event.data.models, (model) => {
			const modelOb = this.getChildModelFactoryBank(event.engine).getFactory(model.type).generateModel({
				initialConfig: model
			});
			modelOb.deserialize({
				...event,
				data: model
			});
			this.addModel(modelOb);
		});
	}

	serialize() {
		return {
			...super.serialize(),
			isSvg: this.options.isSvg,
			isWorktable: this.options.isWorktable,
			transformed: this.options.transformed,
			models: _mapValues(this.models, (model) => {
				return model.serialize();
			})
		};
	}

	isRepaintEnabled() {
		return this.repaintEnabled;
	}

	allowRepaint(allow: boolean = true) {
		this.repaintEnabled = allow;
	}

	remove() {
		if (this.parent) {
			this.parent.removeLayer(this);
		}
		super.remove();
	}

	addModel(model: G['CHILDREN']) {
		model.setParent(this);
		this.models[model.getID()] = model;
	}

	getSelectionEntities(): Array<BaseModel> {
		return _flatMap(this.models, (model) => {
			return model.getSelectionEntities();
		});
	}

	getModels() {
		return this.models;
	}

	getModel(id: string) {
		return this.models[id];
	}

	removeModel(id: string | G['CHILDREN']): boolean {
		const _id = typeof id === 'string' ? id : id.getID();
		if (this.models[_id]) {
			delete this.models[_id];
			return true;
		}
		return false;
	}
}
