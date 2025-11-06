<?php
namespace Salnama_Theme\Inc\Blocks;

class AnimationAttributes {
    public function __construct() {
        add_filter('block_type_metadata', [$this, 'add_animation_attributes']);
    }
    
    public function add_animation_attributes($metadata) {
        if (!isset($metadata['attributes'])) {
            $metadata['attributes'] = [];
        }
        
        $metadata['attributes'] = array_merge($metadata['attributes'], [
            'animationType' => [
                'type' => 'string',
                'default' => ''
            ],
            'animationDuration' => [
                'type' => 'number',
                'default' => 0.6
            ],
            'animationDelay' => [
                'type' => 'number',
                'default' => 0
            ],
            'animationEase' => [
                'type' => 'string',
                'default' => 'power2.out'
            ],
            'animationTrigger' => [
                'type' => 'string',
                'default' => 'scroll'
            ],
            'animationDirection' => [
                'type' => 'string',
                'default' => 'from'
            ],
            'animationX' => [
                'type' => 'number',
                'default' => 0
            ],
            'animationY' => [
                'type' => 'number',
                'default' => 50
            ],
            'animationOpacity' => [
                'type' => 'boolean',
                'default' => true
            ],
            'animationScale' => [
                'type' => 'number',
                'default' => 1
            ],
            'animationRotation' => [
                'type' => 'number',
                'default' => 0
            ],
            'hoverAnimation' => [
                'type' => 'string',
                'default' => ''
            ],
            'hoverScale' => [
                'type' => 'number',
                'default' => 1.05
            ],
            'hoverLift' => [
                'type' => 'number',
                'default' => 0
            ]
        ]);
        
        return $metadata;
    }
}